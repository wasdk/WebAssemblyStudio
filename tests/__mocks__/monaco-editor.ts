const { MonacoUtils } = require("../../src/monaco-utils");

class EditorModel {
    buffer: Array<string>;
    constructor() {
        this.buffer = [""];
    }
    updateOptions() {}
    onDidChangeContent() {}
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
    toString() {
      return this.buffer.join('\n');
    }
}

(<any>global).monaco = {
  editor: {
    setModelLanguage() { },
    setModelMarkers() { },
    createModel() {
      return new EditorModel();
    },
  },
  Range: function (l1, c1, l2, c2) {
    this.r = [l1, c1, l2, c2];
  },
  languages: {
    CompletionItemKind: {
      Keyword: 12
    }
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


