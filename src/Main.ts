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
export const VERSION = '39.0.1'

// Below, we export bound functions to allow developers to use Up without having to create
// any instances of the `Up` class.
//
// Thanks to these functions, it's never necessary to create instances of `Up`, though it
// can sometimes be more convenient.
//
// For example, let's say you're parsing an article and its comments. For each comment,
// you want to specify a unique ID prefix; for both the article and its comments, you
// want to use custom Japanese keywords.
//
// By creating an instance of `Up`, you can specify those custom Japanese keywords just once
// (in the constructor). Then, when parsing each comment, you only need to provide a unique
// ID prefix.

import { Up } from './Implementation/Up'

const up = new Up()

export const parseAndRender = up.parseAndRender.bind(up)
export const parseAndRenderWithTableOfContents = up.parseAndRenderWithTableOfContents.bind(up)
export const parseAndRenderInline = up.parseAndRenderInline.bind(up)
export const parse = up.parse.bind(up)
export const parseInline = up.parseInline.bind(up)
export const render = up.render.bind(up)
export const renderWithTableOfContents = up.renderWithTableOfContents.bind(up)
export const renderInline = up.renderInline.bind(up)
