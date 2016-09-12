import { Up } from './Up'
import { Document } from './SyntaxNodes/Document'
import { InlineDocument } from './SyntaxNodes/InlineDocument'
import { Audio } from './SyntaxNodes/Audio'
import { Bold } from './SyntaxNodes/Bold'
import { Blockquote } from './SyntaxNodes/Blockquote'
import { CodeBlock } from './SyntaxNodes/CodeBlock'
import { DescriptionList } from './SyntaxNodes/DescriptionList'
import { Emphasis } from './SyntaxNodes/Emphasis'
import { ExampleInput } from './SyntaxNodes/ExampleInput'
import { FootnoteBlock } from './SyntaxNodes/FootnoteBlock'
import { Footnote } from './SyntaxNodes/Footnote'
import { Heading } from './SyntaxNodes/Heading'
import { Highlight } from './SyntaxNodes/Highlight'
import { Image } from './SyntaxNodes/Image'
import { InlineCode } from './SyntaxNodes/InlineCode'
import { InlineNsfl } from './SyntaxNodes/InlineNsfl'
import { InlineNsfw } from './SyntaxNodes/InlineNsfw'
import { InlineSpoiler } from './SyntaxNodes/InlineSpoiler'
import { InlineQuote } from './SyntaxNodes/InlineQuote'
import { Italic } from './SyntaxNodes/Italic'
import { LineBlock } from './SyntaxNodes/LineBlock'
import { Link } from './SyntaxNodes/Link'
import { NsflBlock } from './SyntaxNodes/NsflBlock'
import { NsfwBlock } from './SyntaxNodes/NsfwBlock'
import { OrderedList } from './SyntaxNodes/OrderedList'
import { Paragraph } from './SyntaxNodes/Paragraph'
import { NormalParenthetical } from './SyntaxNodes/NormalParenthetical'
import { PlainText } from './SyntaxNodes/PlainText'
import { SectionLink } from './SyntaxNodes/SectionLink'
import { SpoilerBlock } from './SyntaxNodes/SpoilerBlock'
import { SquareParenthetical } from './SyntaxNodes/SquareParenthetical'
import { Stress } from './SyntaxNodes/Stress'
import { Table } from './SyntaxNodes/Table'
import { ThematicBreak } from './SyntaxNodes/ThematicBreak'
import { UnorderedList } from './SyntaxNodes/UnorderedList'
import { Video } from './SyntaxNodes/Video'
import { InlineSyntaxNodeContainer } from './SyntaxNodes/InlineSyntaxNodeContainer'
import { MediaSyntaxNode } from './SyntaxNodes/MediaSyntaxNode'
import { OutlineSyntaxNodeContainer } from './SyntaxNodes/OutlineSyntaxNodeContainer'
import { RevealableInlineSyntaxNode } from './SyntaxNodes/RevealableInlineSyntaxNode'
import { RevealableOutlineSyntaxNode } from './SyntaxNodes/RevealableOutlineSyntaxNode'
import { RichInlineSyntaxNode } from './SyntaxNodes/RichInlineSyntaxNode'
import { RichOutlineSyntaxNode } from './SyntaxNodes/RichOutlineSyntaxNode'


export type Library = typeof Up & {
  Document: typeof Document
  InlineDocument: typeof InlineDocument
  Audio: typeof Audio
  Bold: typeof Bold
  Blockquote: typeof Blockquote
  CodeBlock: typeof CodeBlock
  DescriptionList: typeof DescriptionList
  Emphasis: typeof Emphasis
  ExampleInput: typeof ExampleInput
  FootnoteBlock: typeof FootnoteBlock
  Footnote: typeof Footnote
  Heading: typeof Heading
  Highlight: typeof Highlight
  Image: typeof Image
  InlineCode: typeof InlineCode
  InlineNsfl: typeof InlineNsfl
  InlineNsfw: typeof InlineNsfw
  InlineSpoiler: typeof InlineSpoiler
  InlineQuote: typeof InlineQuote
  Italic: typeof Italic
  LineBlock: typeof LineBlock
  Link: typeof Link
  NsflBlock: typeof NsflBlock
  NsfwBlock: typeof NsfwBlock
  OrderedList: typeof OrderedList
  Paragraph: typeof Paragraph
  NormalParenthetical: typeof NormalParenthetical
  PlainText: typeof PlainText
  SectionLink: typeof SectionLink
  SpoilerBlock: typeof SpoilerBlock
  SquareParenthetical: typeof SquareParenthetical
  Stress: typeof Stress
  Table: typeof Table
  ThematicBreak: typeof ThematicBreak
  UnorderedList: typeof UnorderedList
  Video: typeof Video
  InlineSyntaxNodeContainer: typeof InlineSyntaxNodeContainer
  MediaSyntaxNode: typeof MediaSyntaxNode
  OutlineSyntaxNodeContainer: typeof OutlineSyntaxNodeContainer
  RevealableInlineSyntaxNode: typeof RevealableInlineSyntaxNode
  RevealableOutlineSyntaxNode: typeof RevealableOutlineSyntaxNode
  RichInlineSyntaxNode: typeof RichInlineSyntaxNode
  RichOutlineSyntaxNode: typeof RichOutlineSyntaxNode
}