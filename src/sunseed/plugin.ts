import * as template from "@babel/template";
import * as types from "@babel/types";
let numberOfContracts = 0;
let contractName = "";
let metadata = {};
let extendData = {};

function isMethod(node) {
  if (!node) {
    return false;
  }
  const type = node.type;
  if (type === "ClassMethod" || type === "ClassPrivateMethod") {
    return true;
  }
  const valueType = node.value && node.value.type;
  return (
    valueType === "FunctionExpression" ||
    valueType === "ArrowFunctionExpression"
  );
}

const SUPPORTED_TYPES = [
  "number",
  "string",
  "boolean",
  "bigint",
  "null",
  "undefined",
  "function",
  "array",
  "map",
  "set",
  "date",
  "regexp",
  "promise"
];

function concatUnique(a: any, b: any) {
  if (!Array.isArray(a)) {
    a = [a];
  }
  if (!Array.isArray(b)) {
    b = [b];
  }
  const result = a.concat(b.filter((i: any) => !a.includes(i)));

  for (let i = 0; i < result.length; i++) {
    if (!SUPPORTED_TYPES.includes(result[i])) {
      return "any";
    }
  }

  if (result.length === 1) {
    return result[0];
  }

  return result;
}

function getTypeName(node: any, insideUnion?: any) {
  if (!node) {
    return "any";
  }
  const ta = insideUnion ? node : node.typeAnnotation;
  const tn = ta.type;
  if (!tn) {
    return "any";
  }

  let result: any;
  if (tn === "Identifier") {
    result = ta.name;
  } else if (!tn.endsWith("TypeAnnotation")) {
    result = tn;
  } else {
    result = tn.slice(0, tn.length - 14);
  }

  result = result.toLowerCase();

  // sanitize result

  if (result === "void") {
    result = "undefined";
  } else if (result === "nullliteral") {
    result = "null";
  } else if (result === "generic") {
    const t = ta.id.name.toLowerCase();
    result = SUPPORTED_TYPES.includes(t) ? t : "any";
  } else if (result === "nullable") {
    result = concatUnique(["undefined", "null"], getTypeName(ta));
  } else if (result === "union") {
    result = [];
    ta.types.forEach((ut: any) => {
      result = concatUnique(result, getTypeName(ut, true));
    });
  } else if (!SUPPORTED_TYPES.includes(result)) {
    result = "any";
  }
  return result !== "any" && Array.isArray(result) ? result : [result];
}

function getTypeParams(params: any) {
  return params.map((p: any) => {
    const item = p.left || p;
    const param = {
      name: item.name,
      type: getTypeName(item.typeAnnotation),
      defaultValue: null
    };
    if (p.right) {
      if (types.isNullLiteral(p.right)) {
        param.defaultValue = null;
      } else if (types.isLiteral(p.right)) {
        param.defaultValue = p.right.value;
      }
    }
    return param;
  });
}

const METHOD_DECORATORS = ["transaction", "view", "pure", "payable"];
const PROPERTY_DECORATORS = ["state", "pure"];
const SYSTEM_DECORATORS = ["onReceived", "onreceive"];

export default function(babel: any) {
  const { types: t } = babel;
  return {
    visitor: {
      ClassDeclaration: function(path: any) {
        new IceTea(t).classDeclaration(path);
      },
      Program: {
        exit(path: any) {
          new IceTea(t).exit(path.node);
        }
      }
    }
  };
}

class IceTea {
  types: any;
  onDeployed: number;
  className: string;
  metadata: any;

  constructor(types: any) {
    this.types = types;
    this.onDeployed = 0;
    this.className = "";
    this.metadata = {};
  }

  classDeclaration(path) {
    const klass = path.node;
    this.className = klass.id.name;
    if (!metadata[this.className]) {
      metadata[this.className] = {};
    }
    this.metadata = metadata[this.className];
    if (klass.superClass) {
      extendData[this.className] = klass.superClass.name;
    }

    const contracts = this.findDecorators(klass, "contract");
    numberOfContracts += contracts.length;
    const ctor = this.findConstructor(klass);
    if (ctor) {
      ctor.kind = "method";
      ctor.key.name = "onDeployed";
      this.replaceSuper(ctor);
    }

    if (contracts.length > 0) {
      contractName = klass.id.name;
      this.deleteDecorators(klass, contracts);
    }

    path.get("body.body").map(body => {
      if (["ClassProperty", "ClassPrivateProperty"].includes(body.node.type)) {
        this.classProperty(body);
      } else if (
        ["ClassMethod", "ClassPrivateMethod"].includes(body.node.type)
      ) {
        this.classMethod(body.node);
      }
    });
  }

  classProperty(path) {
    const { node } = path;
    const decorators = node.decorators || [];

    if (
      !decorators.every(decorator => {
        return PROPERTY_DECORATORS.includes(decorator.expression.name);
      })
    ) {
      throw this.buildError("Only @state, @pure for property", node);
    }

    const states = this.findDecorators(node, "state");
    const name = node.key.name || "#" + node.key.id.name; // private property does not have key.name

    if (node.value && !this.isConstant(node.value) && !isMethod(node)) {
      const klassPath = path.parentPath.parentPath;
      let onDeploy = this.findMethod(klassPath.node, "onDeployed");
      if (!onDeploy) {
        // class noname is only used for valid syntax
        const fn = template.smart(`
          class noname {
            onDeployed () {}
          }
        `);
        klassPath.node.body.body.unshift(...fn().body.body);
        onDeploy = klassPath.node.body.body[0];
        this.metadata["onDeployed"] = {
          type: "ClassMethod",
          decorators: ["payable"]
        };
      }
      const fn = template.smart(`
        this.NAME = DEFAULT
      `);
      onDeploy.body.body.unshift(
        fn({
          NAME: name,
          DEFAULT: node.value
        })
      );

      // initialization is already added constructor
      if (states.length === 0) {
        path.remove();
      }
    }

    if (states.length > 0) {
      if (isMethod(node)) {
        throw this.buildError("function cannot be decorated as @state", node);
      }

      this.wrapState(path);

      if (!this.metadata[name]) {
        this.metadata[name] = {
          type: node.type,
          decorators: [
            ...decorators.map(decorator => decorator.expression.name),
            "view"
          ],
          fieldType: getTypeName(node.typeAnnotation)
        };
      }
      return;
    }

    if (!this.metadata[name]) {
      this.metadata[name] = {
        type: node.type,
        decorators: decorators.map(decorator => decorator.expression.name)
      };

      if (!isMethod(node)) {
        this.metadata[name]["fieldType"] = getTypeName(node.typeAnnotation);
        if (decorators.length === 0) {
          this.metadata[name]["decorators"].push("pure");
        }
      } else {
        this.metadata[name]["returnType"] = getTypeName(node.value.returnType);
        this.metadata[name]["params"] = getTypeParams(node.value.params);
        if (decorators.length === 0) {
          this.metadata[name]["decorators"].push("view");
        }
      }
    }
  }

  classMethod(klass) {
    const name = klass.key.name || "#" + klass.key.id.name;
    if (name === "__on_received") {
      throw this.buildError(
        "__on_received cannot be specified directly.",
        klass
      );
    }
    if (name === "onDeployed") {
      if (this.onDeployed > 0) {
        throw this.buildError(
          "onDeployed cannot be specified directly.",
          klass
        );
      }
      this.onDeployed += 1;
    }
    if (name.startsWith("#")) {
      const payables = this.findDecorators(klass, "payable");
      if (payables.length > 0) {
        throw this.buildError("Private function cannot be payable", klass);
      }
    }

    const decorators = klass.decorators || [];
    if (!this.metadata[name]) {
      this.metadata[name] = {
        type: klass.type,
        decorators: decorators.map(decorator => decorator.expression.name),
        returnType: getTypeName(klass.returnType),
        params: getTypeParams(klass.params)
      };
      if (
        !this.metadata[name].decorators.some(decorator => {
          return METHOD_DECORATORS.includes(decorator);
        })
      ) {
        this.metadata[name].decorators.push("view");
      }
    }

    const onreceives = this.findDecorators(klass, "onReceived", "onreceive");
    if (onreceives.length > 0) {
      const payables = this.findDecorators(klass, "payable");
      if (payables.length === 0 && klass.body.body.length > 0) {
        throw this.buildError(
          "non-payable @onreceive function should have empty body.",
          klass
        );
      }
      if (this.metadata["__on_received"]) {
        throw this.buildError("only one @onreceive per class.", klass);
      }
      this.metadata["__on_received"] = klass.key.name;
    }

    this.deleteDecorators(
      klass,
      this.findDecorators(klass, ...METHOD_DECORATORS, ...SYSTEM_DECORATORS)
    );
  }

  exit(node) {
    if (numberOfContracts === 0) {
      throw this.buildError(
        "Your smart contract does not have @contract.",
        node
      );
    }
    if (numberOfContracts > 1) {
      throw this.buildError(
        "Your smart contract has more than one @contract.",
        node
      );
    }

    let name = contractName;
    let parent = extendData[name];
    while (parent) {
      metadata[contractName] = {
        ...metadata[parent],
        ...metadata[contractName]
      };
      name = parent;
      parent = extendData[name];
    }

    this.appendNewCommand(node);
    this.appendMetadata(node);
    this.reset();
  }

  reset() {
    numberOfContracts = 0;
    contractName = "";
    metadata = {};
    extendData = {};
  }

  replaceSuper(ctor) {
    ctor.body.body = ctor.body.body.map(body => {
      if (!body.expression || body.expression.type !== "CallExpression") {
        return body;
      }
      if (body.expression.callee.type === "Super") {
        const superTemplate = template.smart(`
				  super.onDeployed(ARGUMENTS)
        `);
        body = superTemplate({
          ARGUMENTS: body.expression.arguments
        });
      }
      return body;
    });
  }

  wrapState(path) {
    const { node } = path;
    const name = node.key.name || "#" + node.key.id.name;
    const wrap = template.smart(`
      class noname {
        get NAME() {
          return this.getState("NAME", DEFAULT);
        }
        set NAME(value) {
          this.setState("NAME", value);
        }
      }
    `);
    path.replaceWithMultiple(
      wrap({
        NAME: name,
        DEFAULT: node.value
      }).body.body
    );
  }

  appendNewCommand(node) {
    const append = template.smart(`
      const __contract = new NAME();
    `);
    node.body.push(
      append({
        NAME: contractName
      })
    );
  }

  appendMetadata(node) {
    const meta = template.smart(`
      const __metadata = META
    `);
    node.body.push(
      meta({
        META: this.types.valueToNode(metadata[contractName])
      })
    );
  }

  findConstructor(klass) {
    return klass.body.body.filter(body => {
      return body.kind === "constructor";
    })[0];
  }

  findMethod(klass: any, ...names) {
    return klass.body.body.filter(body => {
      return body.type === "ClassMethod" && names.includes(body.key.name);
    })[0];
  }

  buildError(message: any, nodePath: any) {
    this.reset();
    if (nodePath && nodePath.buildCodeFrameError) {
      return nodePath.buildCodeFrameError(message);
    }
    return new SyntaxError(message);
  }

  findDecorators(klass: any, ...names) {
    return (klass.decorators || []).filter(decorator => {
      return names.includes(decorator.expression.name);
    });
  }

  deleteDecorators(klass: any, decorators) {
    decorators.forEach(decorator => {
      const index = klass.decorators.indexOf(decorator);
      if (index >= 0) {
        klass.decorators.splice(index, 1);
      }
    });
  }

  isConstant(value: any): any {
    const { types } = this;
    if (types.isLiteral(value) && value.type !== "TemplateLiteral") {
      return true;
    }
    if (value.type === "ArrayExpression") {
      return (
        value.elements &&
        value.elements.every((element: any) => {
          return this.isConstant(element);
        })
      );
    }
    if (value.type === "BinaryExpression") {
      return (
        value.left &&
        value.right &&
        this.isConstant(value.left) &&
        this.isConstant(value.right)
      );
    }
    if (value.type === "ObjectExpression") {
      return (
        value.properties &&
        value.properties.every((property: any) => {
          return (
            property.key.type !== "TemplateLiteral" &&
            this.isConstant(property.value)
          );
        })
      );
    }
    return false;
  }
}
