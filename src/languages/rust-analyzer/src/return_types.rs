use serde::{Deserialize, Serialize};
use serde_repr::Serialize_repr;

#[derive(Serialize)]
pub struct Hover {
    pub range: Range,
    pub contents: Vec<MarkdownString>,
}

#[derive(Serialize, Deserialize, Clone, Copy)]
pub struct Range {
    pub startLineNumber: u32,
    pub startColumn: u32,
    pub endLineNumber: u32,
    pub endColumn: u32,
}

#[derive(Serialize)]
pub struct MarkdownString {
    pub value: String,
}

#[derive(Serialize, Deserialize)]
pub struct CodeLensSymbol {
    pub range: Range,
    pub command: Option<Command>,
}

#[derive(Serialize, Deserialize)]
pub struct Command {
    pub id: String,
    pub title: String,
    pub positions: Vec<Range>, // customized
}

#[derive(Serialize)]
pub struct Highlight {
    pub tag: Option<&'static str>,
    pub range: Range,
}

#[derive(Serialize)]
pub struct TextEdit {
    pub range: Range,
    pub text: String,
}

#[derive(Serialize)]
pub struct UpdateResult {
    pub diagnostics: Vec<Diagnostic>,
}

#[derive(Serialize)]
pub struct Diagnostic {
    pub message: String,
    pub startLineNumber: u32,
    pub startColumn: u32,
    pub endLineNumber: u32,
    pub endColumn: u32,
    pub severity: MarkerSeverity,
}

#[allow(dead_code)]
#[derive(Serialize_repr)]
#[repr(u8)]
pub enum MarkerSeverity {
    Hint = 1,
    Info = 2,
    Warning = 4,
    Error = 8,
}

#[derive(Serialize)]
pub struct RenameLocation {
    pub range: Range,
    pub text: String,
}

#[derive(Serialize)]
pub struct CompletionItem {
    pub label: String,
    pub range: Range,
    pub kind: CompletionItemKind,
    pub detail: Option<String>,
    pub insertText: String,
    pub insertTextRules: CompletionItemInsertTextRule,
    pub documentation: Option<MarkdownString>,
    pub filterText: String,
    pub additionalTextEdits: Vec<TextEdit>,
}

#[allow(dead_code)]
#[derive(Serialize_repr)]
#[repr(u8)]
pub enum CompletionItemKind {
    Method = 0,
    Function = 1,
    Constructor = 2,
    Field = 3,
    Variable = 4,
    Class = 5,
    Struct = 6,
    Interface = 7,
    Module = 8,
    Property = 9,
    Event = 10,
    Operator = 11,
    Unit = 12,
    Value = 13,
    Constant = 14,
    Enum = 15,
    EnumMember = 16,
    Keyword = 17,
    Text = 18,
    Color = 19,
    File = 20,
    Reference = 21,
    Customcolor = 22,
    Folder = 23,
    TypeParameter = 24,
    Snippet = 25,
}

#[allow(dead_code)]
#[derive(Serialize_repr)]
#[repr(u8)]
pub enum CompletionItemInsertTextRule {
    None = 0,
    /**
     * Adjust whitespace/indentation of multiline insert texts to
     * match the current line indentation.
     */
    KeepWhitespace = 1,
    /**
     * `insertText` is a snippet.
     */
    InsertAsSnippet = 4,
}

#[derive(Serialize)]
pub struct ParameterInformation {
    pub label: String,
}

#[derive(Serialize)]
pub struct SignatureInformation {
    pub label: String,
    pub documentation: Option<MarkdownString>,
    pub parameters: Vec<ParameterInformation>,
}

#[derive(Serialize)]
pub struct SignatureHelp {
    pub signatures: [SignatureInformation; 1],
    pub activeSignature: u32,
    pub activeParameter: Option<usize>,
}

#[derive(Serialize)]
pub struct LocationLink {
    pub originSelectionRange: Range,
    pub range: Range,
    pub targetSelectionRange: Range,
}

#[allow(dead_code)]
#[derive(Serialize_repr)]
#[repr(u8)]
pub enum SymbolTag {
    None = 0,
    Deprecated = 1,
}

#[allow(dead_code)]
#[derive(Serialize_repr)]
#[repr(u8)]
pub enum SymbolKind {
    File = 0,
    Module = 1,
    Namespace = 2,
    Package = 3,
    Class = 4,
    Method = 5,
    Property = 6,
    Field = 7,
    Constructor = 8,
    Enum = 9,
    Interface = 10,
    Function = 11,
    Variable = 12,
    Constant = 13,
    String = 14,
    Number = 15,
    Boolean = 16,
    Array = 17,
    Object = 18,
    Key = 19,
    Null = 20,
    EnumMember = 21,
    Struct = 22,
    Event = 23,
    Operator = 24,
    TypeParameter = 25,
}

#[derive(Serialize)]
pub struct DocumentSymbol {
    pub name: String,
    pub detail: String,
    pub kind: SymbolKind,
    pub tags: [SymbolTag; 1],
    pub containerName: Option<String>,
    pub range: Range,
    pub selectionRange: Range,
    pub children: Option<Vec<DocumentSymbol>>,
}

#[allow(dead_code)]
#[derive(Serialize)]
#[serde(rename_all = "lowercase")]
pub enum FoldingRangeKind {
    Comment,
    Imports,
    Region,
}

#[derive(Serialize)]
pub struct FoldingRange {
    pub start: u32,
    pub end: u32,
    pub kind: Option<FoldingRangeKind>,
}
