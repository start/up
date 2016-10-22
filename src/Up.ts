import { Transformer, RenderedDocumentAndTableOfContents } from './Transformer'
import { Settings } from './Settings'
import { Document } from './SyntaxNodes/Document'
import { InlineDocument } from './SyntaxNodes/InlineDocument'


// These functions allow developers to use Up without having to create any instances of
// the `Transformer` class.
//
// Though it's never necessary to create instances of `Transformer`, it's sometimes more
// convenient.
//
// For example, let's say you're parsing an article and its comments. For each comment,
// you want to specify a unique ID prefix; for both the article and its comments, you
// want to use custom Japanese keywords. 
//
// By creating an instance of `Transformer`, you can specify those custom Japanese keywords
// just once (in the constructor). Then, when parsing each comment, you only need
// to provide a unique ID prefix.
const up = new Transformer()

// Converts Up markup into HTML and returns the result.
export function parseAndRender(markup: string, settings?: Settings): string {
  return up.parseAndRender(markup, settings)
}

// This function converts Up markup into two pieces of HTML, both of which are returned:
//
// 1. A table of contents
// 2. The document itself
export function parseAndRenderDocumentAndTableOfContents(markup: string, settings?: Settings): RenderedDocumentAndTableOfContents {
  return up.parseAndRenderDocumentAndTableOfContents(markup, settings)
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
export function renderDocumentAndTableOfContents(document: Document, renderingSettings?: Settings.Rendering): RenderedDocumentAndTableOfContents {
  return up.renderDocumentAndTableOfContents(document, renderingSettings)
}

// Converts an inline syntax tree into inline HTML and returns the result.
export function renderInline(inlineDocument: InlineDocument, renderingSettings?: Settings.Rendering): string {
  return up.renderInline(inlineDocument, renderingSettings)
}

export { Transformer, RenderedDocumentAndTableOfContents } from './Transformer'
export { Settings } from './Settings'

export { Document } from './SyntaxNodes/Document'
export { InlineDocument } from './SyntaxNodes/InlineDocument'

export { Audio } from './SyntaxNodes/Audio'
export { Blockquote } from './SyntaxNodes/Blockquote'
export { Bold } from './SyntaxNodes/Bold'
export { CodeBlock } from './SyntaxNodes/CodeBlock'
export { DescriptionList } from './SyntaxNodes/DescriptionList'
export { Emphasis } from './SyntaxNodes/Emphasis'
export { ExampleInput } from './SyntaxNodes/ExampleInput'
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
export { OrderedList } from './SyntaxNodes/OrderedList'
export { Paragraph } from './SyntaxNodes/Paragraph'
export { RevealableBlock } from './SyntaxNodes/RevealableBlock'
export { SectionLink } from './SyntaxNodes/SectionLink'
export { SquareParenthetical } from './SyntaxNodes/SquareParenthetical'
export { Stress } from './SyntaxNodes/Stress'
export { Table } from './SyntaxNodes/Table'
export { Text } from './SyntaxNodes/Text'
export { ThematicBreak } from './SyntaxNodes/ThematicBreak'
export { UnorderedList } from './SyntaxNodes/UnorderedList'
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

// This should always match the `version` field in `package.json`.
export const VERSION = '30.1.0'
