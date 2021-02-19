import IRichLanguageConfiguration = monaco.languages.LanguageConfiguration;
import IPosition = monaco.IPosition;
export declare const Cton: {
    MonarchDefinitions: {
        keywords: string[];
        typeKeywords: string[];
        operators: any;
        symbols: RegExp;
        escapes: RegExp;
        tokenizer: {
            root: any;
            string: ((string | RegExp)[] | (RegExp | {
                token: string;
                bracket: string;
                next: string;
            })[])[];
            whitespace: (string | RegExp)[][];
        };
    };
    LanguageConfiguration: IRichLanguageConfiguration;
    CompletionItemProvider: {
        provideCompletionItems: (model: monaco.editor.ITextModel, position: IPosition) => monaco.languages.CompletionItem[];
    };
    HoverProvider: {
        provideHover: (model: monaco.editor.ITextModel, position: IPosition) => {
            range: monaco.Range;
            contents: (string | {
                language: string;
                value: string;
            })[];
        };
    };
};
