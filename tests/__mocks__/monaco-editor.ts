const { MonacoUtils } = require("../../src/monaco-utils");

class EditorModel {
    buffer: Array<string>;
    constructor() {
        this.buffer = [""];
    }
    updateOptions() {}
    onDidChangeContent() {}
    saveViewState() { }
    getLineCount() {
        return this.buffer.length - 1; 
    }
    getLineMaxColumn(line) {
        return this.buffer[line].length;
    }
    applyEdits(edits) {
      edits.forEach(({range:{r: [l1, c1, l2, c2]}, text}) => {
        const t = this.buffer[l1].slice(0, c1) + text + this.buffer[l2].slice(c2);
        const lines = t.split('\n');
        Array.prototype.splice.apply(this.buffer, [l1, l2 - l1 + 1].concat(lines));
      }, this);
    }
    setValue() {}
    getValue() {}
    toString() {
      return this.buffer.join('\n');
    }
}

(<any>global).monaco = {
  editor: {
    onDidFocusEditor() { },
    onContextMenu() { },
    setModelLanguage() { },
    setModelMarkers() { },
    addAction() { },
    addCommand() { },
    setModel() {},
    getLineCount() {},
    revealLine() {},
    restoreViewState() { },
    saveViewState() { },
    updateOptions() { },
    layout() {},
    createModel() {
      return new EditorModel();
    },
    create() {
      return this;
    },
    getModel() {
      return this;
    },
    IEditorConstructionOptions: {
      value: String
    }
  },
  Range: function (l1, c1, l2, c2) {
    this.r = [l1, c1, l2, c2];
  },
  languages: {
    CompletionItemKind: {
      Keyword: 12
    }
  },
  KeyMod: {
    CtrlCmd: 0,
    Alt: 2
  },
  KeyCode: {
    KEY_S: 83,
    KEY_B: 66,
    Enter: 13,
  }
};

class ContextViewService {
    constructor() { }
}

MonacoUtils.ContextViewService = ContextViewService;

class ContextMenuService {
    constructor() { }
    showContextMenu() { }
}

MonacoUtils.ContextMenuService = ContextMenuService;
