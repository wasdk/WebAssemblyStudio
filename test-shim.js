global.requestAnimationFrame = function(callback) {
  setTimeout(callback, 0);
};

global.Worker = function() {
  this.addEventListener = function () {
    // Nop
  }
}

global.monaco = {
  editor: {
    onDidChangeContent() { },
    getLineMaxColumn() { },
    applyEdits() { },
    setValue() { },
    getValue() { },
    toString() { },
    onDidFocusEditorText() { },
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
      return this;
    },
    create() {
      return this;
    },
    getModel() {
      return this;
    },
    IEditorConstructionOptions: {
      value: String
    },
    uri: {
      toString: () => "uri"
    },
    defineTheme() { },

  },
  Range: function (l1, c1, l2, c2) {
    this.r = [l1, c1, l2, c2];
  },
  languages: {
    CompletionItemKind: {
      Keyword: 12
    },
    typescript: {
      getTypeScriptWorker() { },
      typescriptDefaults: {
        addExtraLib() {},
        setCompilerOptions() {}
      },
      javascriptDefaults: {
        setCompilerOptions() {}
      }
    },
    register() {},
    onLanguage() {},
    setMonarchTokensProvider() {},
    setLanguageConfiguration() {},
    registerCompletionItemProvider() {},
    registerHoverProvider() {},

  },
  KeyMod: {
    CtrlCmd: 0,
    Alt: 2
  },
  KeyCode: {
    KEY_S: 83,
    KEY_B: 66,
    Enter: 13,
  },
  MarkerSeverity: {
    Info: 2,
    Warning: 4,
    Error: 8
  },
  Promise: {
    as: (args) => Promise.resolve(args)
  }
}
