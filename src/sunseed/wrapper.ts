export default src => `
    'use strict';
    const revert = text => {throw new Error(text || "Transaction reverted.")};
    const expect = (condition, text) => {if (!condition) revert(text)}
    const assert = expect;

    const {msg, block, tags: __tags, balanceOf, loadContract} = this.getEnv();
    const now = block ? block.timestamp : 0;

    assert(typeof msg !== "undefined" && msg, "Invalid or corrupt transaction data.");
    expect(msg.name, "Method name not specified.");

    ${src}

    // block to scope our let/const
    {
        const __name = typeof __metadata[msg.name] === 'string' ? __metadata[msg.name] : msg.name
        if (["__on_deployed", "__on_received"].includes(msg.name) && !(__name in __contract)) {
            // call event methods but contract does not have one
            return;
        }
        expect(["__metadata", "address", "balance", "deployedBy"].includes(__name) ||
            (__name in __contract && !__name.startsWith('#')), "Method " + __name + " is private or does not exist.");

        Object.defineProperties(__contract, Object.getOwnPropertyDescriptors(this));
        const __c = {
            instance: __contract,
            meta: __metadata
        };

        if (__name === "__metadata") {
            return __c;
        }

        const __checkType = (value, typeHolder, typeProp, info) => {
            if (!typeHolder) return value
            const types = typeHolder[typeProp]
            if (types && Array.isArray(types)) {
                let valueType = value === null ? 'null' : typeof value;
                if (!types.includes(valueType)) {
                    if (valueType === 'object') {
                        valueType = Object.prototype.toString.call(value).split(' ')[1].slice(0, -1).toLowerCase()
                        if (types.includes(valueType)) return value;
                    }
                    revert("Error executing '" + __name + "': wrong " + info + " type. Expect: " +
                    types.join(" | ") + ". Got: " + valueType + ".");
                }
            }
            return value;
        }

        if (typeof __c.instance[__name] === "function") {
            // Check stateMutablitity
            const isValidCallType = (d) => {
                if (["__on_deployed", "__on_received"].includes(__name) || !__metadata[__name]) return true; // FIXME
                if (!__metadata[__name].decorators) {
                    return false;
                }
                if (d === "transaction" && __metadata[__name].decorators.includes("payable")) {
                    return true;
                }
                return __metadata[__name].decorators.includes(d);
            }
            if (!isValidCallType(msg.callType)) {
                revert("Method " + __name + " is not decorated as @" + msg.callType + " and cannot be invoked in such mode");
            }
            // Check input param type
            const params = msg.params;
            if (__metadata[__name] && __metadata[__name].params && __metadata[__name].params.length) {
                __metadata[__name].params.forEach((p, index) => {
                    const pv = (params.length  > index) ? params[index] : undefined;
                    __checkType(pv, p, 'type', "param '" + p.name + "'");
                })
            }

            // Call the function, finally
            const result = __c.instance[__name].apply(__c.instance, params);
            return __checkType(result, __metadata[__name], 'returnType', "return");
        }

        return __checkType(__c.instance[__name], __metadata[__name], 'fieldType', 'field');
    }
`;
