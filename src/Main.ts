import { Settings } from './Implementation/Settings'
import { Document } from './Implementation/SyntaxNodes/Document'
import { InlineDocument } from './Implementation/SyntaxNodes/InlineDocument'
import { DocumentAndTableOfContentsHtml, Up } from './Implementation/Up'


// The functions below allow developers to use Up without having to create any instances of
// the `Up` class.
//
// Thanks to these functions, it's never necessary to create instances of `Up`, though it's
// still sometimes more convenient.
//
// For example, let's say you're parsing an article and its comments. For each comment,
// you want to specify a unique ID prefix; for both the article and its comments, you
// want to use custom Japanese keywords.
//
// By creating an instance of `Up`, you can specify those custom Japanese keywords just once
// (in the constructor). Then, when parsing each comment, you only need to provide a unique
// ID prefix.
const up = new Up()

// Converts Up markup into HTML and returns the result.
export function parseAndRender(markup: string, settings?: Settings): string {
  return up.parseAndRender(markup, settings)
}

// This function converts Up markup into two pieces of HTML, both of which are returned:
//
// 1. A table of contents
// 2. The document itself
export function parseAndRenderWithTableOfContents(markup: string, settings?: Settings): DocumentAndTableOfContentsHtml {
  return up.parseAndRenderWithTableOfContents(markup, settings)
}

// Converts inline Up markup into inline HTML and returns the result.
export function parseAndRenderInline(inlineMarkup: string, settings?: Settings): string {
  return up.parseAndRenderInline(inlineMarkup, settings)
}

// Parses Up markup and returns the resulting syntax tree.
export function parse(markup: string, parsingSettings?: Settings.Parsing): Document {
  return up.parse(markup, parsingSettings)
}

// Parses inline Up markup and returns the resulting inline syntax tree.
export function parseInline(inlineMarkup: string, parsingSettings?: Settings.Parsing): InlineDocument {
  return up.parseInline(inlineMarkup, parsingSettings)
}

// Converts a syntax tree into HTML, then returns the result.
export function render(document: Document, renderingSettings?: Settings.Rendering): string {
  return up.render(document, renderingSettings)
}

// This function converts a syntax tree into two pieces of HTML, both of which are returned:
//
// 1. A table of contents
// 2. The document itself
export function renderWithTableOfContents(document: Document, renderingSettings?: Settings.Rendering): DocumentAndTableOfContentsHtml {
  return up.renderWithTableOfContents(document, renderingSettings)
}

// Converts an inline syntax tree into inline HTML and returns the result.
export function renderInline(inlineDocument: InlineDocument, renderingSettings?: Settings.Rendering): string {
  return up.renderInline(inlineDocument, renderingSettings)
}

export { Up, DocumentAndTableOfContentsHtml } from './Implementation/Up'
export { Settings } from './Implementation/Settings'

export { Document } from './Implementation/SyntaxNodes/Document'
export { InlineDocument } from './Implementation/SyntaxNodes/InlineDocument'

export { Audio } from './Implementation/SyntaxNodes/Audio'
export { Blockquote } from './Implementation/SyntaxNodes/Blockquote'
export { Bold } from './Implementation/SyntaxNodes/Bold'
export { BulletedList } from './Implementation/SyntaxNodes/BulletedList'
export { CodeBlock } from './Implementation/SyntaxNodes/CodeBlock'
export { DescriptionList } from './Implementation/SyntaxNodes/DescriptionList'
export { Emphasis } from './Implementation/SyntaxNodes/Emphasis'
export { ExampleUserInput } from './Implementation/SyntaxNodes/ExampleUserInput'
export { Footnote } from './Implementation/SyntaxNodes/Footnote'
export { FootnoteBlock } from './Implementation/SyntaxNodes/FootnoteBlock'
export { Heading } from './Implementation/SyntaxNodes/Heading'
export { Highlight } from './Implementation/SyntaxNodes/Highlight'
export { Image } from './Implementation/SyntaxNodes/Image'
export { InlineCode } from './Implementation/SyntaxNodes/InlineCode'
export { InlineQuote } from './Implementation/SyntaxNodes/InlineQuote'
export { InlineRevealable } from './Implementation/SyntaxNodes/InlineRevealable'
export { Italic } from './Implementation/SyntaxNodes/Italic'
export { LineBlock } from './Implementation/SyntaxNodes/LineBlock'
export { Link } from './Implementation/SyntaxNodes/Link'
export { NormalParenthetical } from './Implementation/SyntaxNodes/NormalParenthetical'
export { NumberedList } from './Implementation/SyntaxNodes/NumberedList'
export { Paragraph } from './Implementation/SyntaxNodes/Paragraph'
export { RevealableBlock } from './Implementation/SyntaxNodes/RevealableBlock'
export { SectionLink } from './Implementation/SyntaxNodes/SectionLink'
export { SquareParenthetical } from './Implementation/SyntaxNodes/SquareParenthetical'
export { Stress } from './Implementation/SyntaxNodes/Stress'
export { Table } from './Implementation/SyntaxNodes/Table'
export { Text } from './Implementation/SyntaxNodes/Text'
export { ThematicBreak } from './Implementation/SyntaxNodes/ThematicBreak'
export { Video } from './Implementation/SyntaxNodes/Video'

export { InlineSyntaxNodeContainer } from './Implementation/SyntaxNodes/InlineSyntaxNodeContainer'
export { MediaSyntaxNode } from './Implementation/SyntaxNodes/MediaSyntaxNode'
export { OutlineSyntaxNodeContainer } from './Implementation/SyntaxNodes/OutlineSyntaxNodeContainer'
export { ParentheticalSyntaxNode } from './Implementation/SyntaxNodes/ParentheticalSyntaxNode'
export { RichInlineSyntaxNode } from './Implementation/SyntaxNodes/RichInlineSyntaxNode'
export { RichOutlineSyntaxNode } from './Implementation/SyntaxNodes/RichOutlineSyntaxNode'

export { InlineSyntaxNode } from './Implementation/SyntaxNodes/InlineSyntaxNode'
export { OutlineSyntaxNode } from './Implementation/SyntaxNodes/OutlineSyntaxNode'
export { SyntaxNode } from './Implementation/SyntaxNodes/SyntaxNode'

// This must always match the `version` field in `package.json`.
export const VERSION = '39.0.0'
