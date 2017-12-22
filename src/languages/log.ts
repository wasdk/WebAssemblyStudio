import "monaco-editor";

import IRichLanguageConfiguration = monaco.languages.LanguageConfiguration;
import ILanguage = monaco.languages.IMonarchLanguage;
import IModel = monaco.editor.IModel;
import IPosition = monaco.IPosition;

export const Log = {
  MonarchTokensProvider: {
    tokenizer: {
      root: [
        [/error:.*/, "custom-error"],
        [/warn:.*/, "custom-warn"],
        [/info:.*/, "custom-info"],
      ]
    }
  }
}