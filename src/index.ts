import { Transformer, RenderedDocumentAndTableOfContents } from './Transformer'
import { UserProvidedSettings } from './UserProvidedSettings'
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
// want to use custom Japanese terms. 
//
// By creating an instance of `Transformer`, you can specify those custom Japanese terms
// just once (in the constructor). Then, when parsing each comment, you only need
// to provide a unique ID prefix.
const up = new Transformer()

// Converts Up markup into HTML and returns the result.
export function parseAndRender(markup: string, settings?: UserProvidedSettings): string {
  return up.parseAndRender(markup, settings)
}

// This method converts Up markup into two pieces of HTML, both of which are returned:
//
// 1. A table of contents
// 2. The document itself
export function parseAndRenderDocumentAndTableOfContents(markup: string, settings?: UserProvidedSettings): RenderedDocumentAndTableOfContents {
  return up.parseAndRenderDocumentAndTableOfContents(markup, settings)
}

// Converts inline Up markup into inline HTML and returns the result.
export function parseAndRenderInline(inlineMarkup: string, settings?: UserProvidedSettings): string {
  return up.parseAndRenderInline(inlineMarkup, settings)
}

// Parses Up markup and returns the resulting syntax tree.
export function parse(markup: string, parsingSettings?: UserProvidedSettings.Parsing): Document {
  return up.parse(markup, parsingSettings)
}

// Parses inline Up markup and returns the resulting inline syntax tree.
export function parseInline(inlineMarkup: string, parsingSettings?: UserProvidedSettings.Parsing): InlineDocument {
  return up.parseInline(inlineMarkup, parsingSettings)
}

// Converts a syntax tree into HTML, then returns the result.
export function render(document: Document, renderingSettings?: UserProvidedSettings.Rendering): string {
  return up.render(document, renderingSettings)
}

// This method converts a syntax tree into two pieces of HTML, both of which are returned:
//
// 1. A table of contents
// 2. The document itself
export function renderDocumentAndTableOfContents(document: Document, renderingSettings?: UserProvidedSettings.Rendering): RenderedDocumentAndTableOfContents {
  return up.renderDocumentAndTableOfContents(document, renderingSettings)
}

// Converts an inline syntax tree into inline HTML and returns the result.
export function renderInline(inlineDocument: InlineDocument, renderingSettings?: UserProvidedSettings.Rendering): string {
  return up.renderInline(inlineDocument, renderingSettings)
}

export { Transformer } from './Transformer'
export { UserProvidedSettings } from './UserProvidedSettings'

export { Document } from './SyntaxNodes/Document'
export { InlineDocument } from './SyntaxNodes/InlineDocument'

export { Audio } from './SyntaxNodes/Audio'
export { Bold } from './SyntaxNodes/Bold'
export { Blockquote } from './SyntaxNodes/Blockquote'
export { CodeBlock } from './SyntaxNodes/CodeBlock'
export { DescriptionList } from './SyntaxNodes/DescriptionList'
export { Emphasis } from './SyntaxNodes/Emphasis'
export { ExampleInput } from './SyntaxNodes/ExampleInput'
export { FootnoteBlock } from './SyntaxNodes/FootnoteBlock'
export { Footnote } from './SyntaxNodes/Footnote'
export { Heading } from './SyntaxNodes/Heading'
export { Highlight } from './SyntaxNodes/Highlight'
export { Image } from './SyntaxNodes/Image'
export { InlineCode } from './SyntaxNodes/InlineCode'
export { InlineNsfl } from './SyntaxNodes/InlineNsfl'
export { InlineNsfw } from './SyntaxNodes/InlineNsfw'
export { InlineSpoiler } from './SyntaxNodes/InlineSpoiler'
export { InlineQuote } from './SyntaxNodes/InlineQuote'
export { Italic } from './SyntaxNodes/Italic'
export { LineBlock } from './SyntaxNodes/LineBlock'
export { Link } from './SyntaxNodes/Link'
export { NsflBlock } from './SyntaxNodes/NsflBlock'
export { NsfwBlock } from './SyntaxNodes/NsfwBlock'
export { OrderedList } from './SyntaxNodes/OrderedList'
export { Paragraph } from './SyntaxNodes/Paragraph'
export { NormalParenthetical } from './SyntaxNodes/NormalParenthetical'
export { PlainText } from './SyntaxNodes/PlainText'
export { SectionLink } from './SyntaxNodes/SectionLink'
export { SpoilerBlock } from './SyntaxNodes/SpoilerBlock'
export { SquareParenthetical } from './SyntaxNodes/SquareParenthetical'
export { Stress } from './SyntaxNodes/Stress'
export { Table } from './SyntaxNodes/Table'
export { ThematicBreak } from './SyntaxNodes/ThematicBreak'
export { UnorderedList } from './SyntaxNodes/UnorderedList'
export { Video } from './SyntaxNodes/Video'

export { InlineSyntaxNodeContainer } from './SyntaxNodes/InlineSyntaxNodeContainer'
export { MediaSyntaxNode } from './SyntaxNodes/MediaSyntaxNode'
export { OutlineSyntaxNodeContainer } from './SyntaxNodes/OutlineSyntaxNodeContainer'
export { RevealableInlineSyntaxNode } from './SyntaxNodes/RevealableInlineSyntaxNode'
export { RevealableOutlineSyntaxNode } from './SyntaxNodes/RevealableOutlineSyntaxNode'
export { RichInlineSyntaxNode } from './SyntaxNodes/RichInlineSyntaxNode'
export { RichOutlineSyntaxNode } from './SyntaxNodes/RichOutlineSyntaxNode'

export { InlineSyntaxNode } from './SyntaxNodes/InlineSyntaxNode'
export { OutlineSyntaxNode } from './SyntaxNodes/OutlineSyntaxNode'

// This should always match the `version` field in `package.json`.
export const VERSION = '20.1.0'
