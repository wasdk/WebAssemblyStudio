use super::return_types;
use ra_ide::{
    CompletionItem, CompletionItemKind, Documentation, FileId, FilePosition, Fold, FoldKind,
    FunctionSignature, InsertTextFormat, LineCol, LineIndex, NavigationTarget, RangeInfo, Severity,
};
use ra_syntax::{SyntaxKind, TextRange};
use ra_text_edit::{AtomTextEdit, TextEdit};

pub trait Conv {
    type Output;
    fn conv(self) -> Self::Output;
}

pub trait ConvWith<CTX> {
    type Output;
    fn conv_with(self, ctx: CTX) -> Self::Output;
}

#[derive(Clone, Copy)]
pub struct Position {
    pub line_number: u32,
    pub column: u32,
}

impl ConvWith<(&LineIndex, FileId)> for Position {
    type Output = FilePosition;

    fn conv_with(self, (line_index, file_id): (&LineIndex, FileId)) -> Self::Output {
        let line_col = LineCol { line: self.line_number - 1, col_utf16: self.column - 1 };
        let offset = line_index.offset(line_col);
        FilePosition { file_id, offset }
    }
}

impl ConvWith<&LineIndex> for TextRange {
    type Output = return_types::Range;

    fn conv_with(self, line_index: &LineIndex) -> Self::Output {
        let start = line_index.line_col(self.start());
        let end = line_index.line_col(self.end());

        return_types::Range {
            startLineNumber: start.line + 1,
            startColumn: start.col_utf16 + 1,
            endLineNumber: end.line + 1,
            endColumn: end.col_utf16 + 1,
        }
    }
}

impl Conv for CompletionItemKind {
    type Output = return_types::CompletionItemKind;

    fn conv(self) -> Self::Output {
        use return_types::CompletionItemKind::*;
        match self {
            CompletionItemKind::Keyword => Keyword,
            CompletionItemKind::Snippet => Snippet,
            CompletionItemKind::Module => Module,
            CompletionItemKind::Function => Function,
            CompletionItemKind::Struct => Struct,
            CompletionItemKind::Enum => Enum,
            CompletionItemKind::EnumVariant => EnumMember,
            CompletionItemKind::BuiltinType => Struct,
            CompletionItemKind::Binding => Variable,
            CompletionItemKind::Field => Field,
            CompletionItemKind::Trait => Interface,
            CompletionItemKind::TypeAlias => Struct,
            CompletionItemKind::Const => Constant,
            CompletionItemKind::Static => Value,
            CompletionItemKind::Method => Method,
            CompletionItemKind::TypeParam => TypeParameter,
            CompletionItemKind::Macro => Method,
        }
    }
}

impl Conv for Severity {
    type Output = return_types::MarkerSeverity;

    fn conv(self) -> Self::Output {
        match self {
            Severity::Error => return_types::MarkerSeverity::Error,
            Severity::WeakWarning => return_types::MarkerSeverity::Hint,
        }
    }
}

impl ConvWith<&LineIndex> for &AtomTextEdit {
    type Output = return_types::TextEdit;

    fn conv_with(self, line_index: &LineIndex) -> Self::Output {
        let text = self.insert.clone();
        return_types::TextEdit { range: self.delete.conv_with(line_index), text }
    }
}

impl ConvWith<&LineIndex> for CompletionItem {
    type Output = return_types::CompletionItem;

    fn conv_with(self, line_index: &LineIndex) -> Self::Output {
        let mut additional_text_edits = Vec::new();
        let mut text_edit = None;
        // LSP does not allow arbitrary edits in completion, so we have to do a
        // non-trivial mapping here.
        for atom_edit in self.text_edit().as_atoms() {
            if self.source_range().is_subrange(&atom_edit.delete) {
                text_edit = Some(if atom_edit.delete == self.source_range() {
                    atom_edit.conv_with(line_index)
                } else {
                    assert!(self.source_range().end() == atom_edit.delete.end());
                    let range1 =
                        TextRange::from_to(atom_edit.delete.start(), self.source_range().start());
                    let range2 = self.source_range();
                    let edit1 = AtomTextEdit::replace(range1, String::new());
                    let edit2 = AtomTextEdit::replace(range2, atom_edit.insert.clone());
                    additional_text_edits.push(edit1.conv_with(line_index));
                    edit2.conv_with(line_index)
                })
            } else {
                assert!(self.source_range().intersection(&atom_edit.delete).is_none());
                additional_text_edits.push(atom_edit.conv_with(line_index));
            }
        }
        let return_types::TextEdit { range, text } = text_edit.unwrap();

        return_types::CompletionItem {
            kind: self.kind().unwrap_or(CompletionItemKind::Struct).conv(),
            label: self.label().to_string(),
            range,
            detail: self.detail().map(|it| it.to_string()),
            insertText: text,
            insertTextRules: match self.insert_text_format() {
                InsertTextFormat::PlainText => return_types::CompletionItemInsertTextRule::None,
                InsertTextFormat::Snippet => {
                    return_types::CompletionItemInsertTextRule::InsertAsSnippet
                }
            },
            documentation: self.documentation().map(|doc| doc.conv()),
            filterText: self.lookup().to_string(),
            additionalTextEdits: additional_text_edits,
        }
    }
}

impl Conv for Documentation {
    type Output = return_types::MarkdownString;
    fn conv(self) -> Self::Output {
        fn code_line_ignored_by_rustdoc(line: &str) -> bool {
            let trimmed = line.trim();
            trimmed == "#" || trimmed.starts_with("# ") || trimmed.starts_with("#\t")
        }

        let mut processed_lines = Vec::new();
        let mut in_code_block = false;
        for line in self.as_str().lines() {
            if in_code_block && code_line_ignored_by_rustdoc(line) {
                continue;
            }

            if line.starts_with("```") {
                in_code_block ^= true
            }

            let line = if in_code_block && line.starts_with("```") && !line.contains("rust") {
                "```rust"
            } else {
                line
            };

            processed_lines.push(line);
        }

        return_types::MarkdownString { value: processed_lines.join("\n") }
    }
}

impl Conv for FunctionSignature {
    type Output = return_types::SignatureInformation;
    fn conv(self) -> Self::Output {
        use return_types::{ParameterInformation, SignatureInformation};

        let label = self.to_string();
        let documentation = self.doc.map(|it| it.conv());

        let parameters: Vec<ParameterInformation> = self
            .parameters
            .into_iter()
            .map(|param| ParameterInformation { label: param })
            .collect();

        SignatureInformation { label, documentation, parameters }
    }
}

impl ConvWith<&LineIndex> for RangeInfo<Vec<NavigationTarget>> {
    type Output = Vec<return_types::LocationLink>;
    fn conv_with(self, line_index: &LineIndex) -> Self::Output {
        let selection = self.range.conv_with(&line_index);
        self.info
            .into_iter()
            .map(|nav| {
                let range = nav.full_range().conv_with(&line_index);

                let target_selection_range =
                    nav.focus_range().map(|it| it.conv_with(&line_index)).unwrap_or(range);

                return_types::LocationLink {
                    originSelectionRange: selection,
                    range,
                    targetSelectionRange: target_selection_range,
                }
            })
            .collect()
    }
}

impl Conv for SyntaxKind {
    type Output = return_types::SymbolKind;

    fn conv(self) -> Self::Output {
        use return_types::SymbolKind;
        match self {
            SyntaxKind::FN_DEF => SymbolKind::Function,
            SyntaxKind::STRUCT_DEF => SymbolKind::Struct,
            SyntaxKind::ENUM_DEF => SymbolKind::Enum,
            SyntaxKind::ENUM_VARIANT => SymbolKind::EnumMember,
            SyntaxKind::TRAIT_DEF => SymbolKind::Interface,
            SyntaxKind::MODULE => SymbolKind::Module,
            SyntaxKind::TYPE_ALIAS_DEF => SymbolKind::TypeParameter,
            SyntaxKind::RECORD_FIELD_DEF => SymbolKind::Field,
            SyntaxKind::STATIC_DEF => SymbolKind::Constant,
            SyntaxKind::CONST_DEF => SymbolKind::Constant,
            SyntaxKind::IMPL_BLOCK => SymbolKind::Object,
            _ => SymbolKind::Variable,
        }
    }
}

impl ConvWith<&LineIndex> for TextEdit {
    type Output = Vec<return_types::TextEdit>;

    fn conv_with(self, ctx: &LineIndex) -> Self::Output {
        self.as_atoms().iter().map(|atom| atom.conv_with(ctx)).collect()
    }
}

impl ConvWith<&LineIndex> for Fold {
    type Output = return_types::FoldingRange;

    fn conv_with(self, ctx: &LineIndex) -> Self::Output {
        let range = self.range.conv_with(&ctx);
        return_types::FoldingRange {
            start: range.startLineNumber,
            end: range.endLineNumber,
            kind: match self.kind {
                FoldKind::Comment => Some(return_types::FoldingRangeKind::Comment),
                FoldKind::Imports => Some(return_types::FoldingRangeKind::Imports),
                FoldKind::Mods => None,
                FoldKind::Block => None,
            },
        }
    }
}
