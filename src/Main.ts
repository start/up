import { Settings } from './Settings'
import { Document } from './SyntaxNodes/Document'
import { InlineDocument } from './SyntaxNodes/InlineDocument'
import { DocumentAndTableOfContentsHtml, Up } from './Up'


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

export { Up, DocumentAndTableOfContentsHtml } from './Up'
export { Settings } from './Settings'

export { Document } from './SyntaxNodes/Document'
export { InlineDocument } from './SyntaxNodes/InlineDocument'

export { Audio } from './SyntaxNodes/Audio'
export { Blockquote } from './SyntaxNodes/Blockquote'
export { Bold } from './SyntaxNodes/Bold'
export { BulletedList } from './SyntaxNodes/BulletedList'
export { CodeBlock } from './SyntaxNodes/CodeBlock'
export { DescriptionList } from './SyntaxNodes/DescriptionList'
export { Emphasis } from './SyntaxNodes/Emphasis'
export { ExampleUserInput } from './SyntaxNodes/ExampleUserInput'
export { Footnote } from './SyntaxNodes/Footnote'
export { FootnoteBlock } from './SyntaxNodes/FootnoteBlock'
export { Heading } from './SyntaxNodes/Heading'
export { Highlight } from './SyntaxNodes/Highlight'
export { Image } from './SyntaxNodes/Image'
export { InlineCode } from './SyntaxNodes/InlineCode'
export { InlineQuote } from './SyntaxNodes/InlineQuote'
export { InlineRevealable } from './SyntaxNodes/InlineRevealable'
export { Italic } from './SyntaxNodes/Italic'
export { LineBlock } from './SyntaxNodes/LineBlock'
export { Link } from './SyntaxNodes/Link'
export { NormalParenthetical } from './SyntaxNodes/NormalParenthetical'
export { NumberedList } from './SyntaxNodes/NumberedList'
export { Paragraph } from './SyntaxNodes/Paragraph'
export { RevealableBlock } from './SyntaxNodes/RevealableBlock'
export { SectionLink } from './SyntaxNodes/SectionLink'
export { SquareParenthetical } from './SyntaxNodes/SquareParenthetical'
export { Stress } from './SyntaxNodes/Stress'
export { Table } from './SyntaxNodes/Table'
export { Text } from './SyntaxNodes/Text'
export { ThematicBreak } from './SyntaxNodes/ThematicBreak'
export { Video } from './SyntaxNodes/Video'

export { InlineSyntaxNodeContainer } from './SyntaxNodes/InlineSyntaxNodeContainer'
export { MediaSyntaxNode } from './SyntaxNodes/MediaSyntaxNode'
export { OutlineSyntaxNodeContainer } from './SyntaxNodes/OutlineSyntaxNodeContainer'
export { ParentheticalSyntaxNode } from './SyntaxNodes/ParentheticalSyntaxNode'
export { RichInlineSyntaxNode } from './SyntaxNodes/RichInlineSyntaxNode'
export { RichOutlineSyntaxNode } from './SyntaxNodes/RichOutlineSyntaxNode'

export { InlineSyntaxNode } from './SyntaxNodes/InlineSyntaxNode'
export { OutlineSyntaxNode } from './SyntaxNodes/OutlineSyntaxNode'
export { SyntaxNode } from './SyntaxNodes/SyntaxNode'

// This must always match the `version` field in `package.json`.
export const VERSION = '38.0.1'
