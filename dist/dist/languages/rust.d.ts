import IRichLanguageConfiguration = monaco.languages.LanguageConfiguration;
import IPosition = monaco.IPosition;
export declare const Rust: {
    MonarchDefinitions: {
        defaultToken: string;
        keywords: string[];
        typeKeywords: string[];
        operators: string[];
        symbols: RegExp;
        escapes: RegExp;
        tokenizer: {
            root: ((string | RegExp)[] | (RegExp | string[])[] | (RegExp | {
                cases: {
                    "@keywords": string;
                    "@typeKeywords": string;
                    "@default": string;
                };
            })[] | {
                include: string;
            } | (RegExp | {
                cases: {
                    "@operators": string;
                    "@default": string;
                };
            })[])[];
            whitespace: (string | RegExp)[][];
            comment: (string | RegExp)[][];
            string: (string | RegExp)[][];
        };
    };
    LanguageConfiguration: IRichLanguageConfiguration;
    CompletionItemProvider: {
        provideCompletionItems: (model: monaco.editor.ITextModel, position: IPosition) => monaco.languages.CompletionItem[];
    };
    HoverProvider: {
        provideHover: (model: monaco.editor.ITextModel, position: IPosition) => any;
    };
};
