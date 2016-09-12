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
import { Library } from './Library'


const library = Up as Library

library.Document = Document
library.InlineDocument = InlineDocument
library.Audio = Audio
library.Bold = Bold
library.Blockquote = Blockquote
library.CodeBlock = CodeBlock
library.DescriptionList = DescriptionList
library.Emphasis = Emphasis
library.ExampleInput = ExampleInput
library.FootnoteBlock = FootnoteBlock
library.Footnote = Footnote
library.Heading = Heading
library.Highlight = Highlight
library.Image = Image
library.InlineCode = InlineCode
library.InlineNsfl = InlineNsfl
library.InlineNsfw = InlineNsfw
library.InlineSpoiler = InlineSpoiler
library.InlineQuote = InlineQuote
library.Italic = Italic
library.LineBlock = LineBlock
library.Link = Link
library.NsflBlock = NsflBlock
library.NsfwBlock = NsfwBlock
library.OrderedList = OrderedList
library.Paragraph = Paragraph
library.NormalParenthetical = NormalParenthetical
library.PlainText = PlainText
library.SectionLink = SectionLink
library.SpoilerBlock = SpoilerBlock
library.SquareParenthetical = SquareParenthetical
library.Stress = Stress
library.Table = Table
library.ThematicBreak = ThematicBreak
library.UnorderedList = UnorderedList
library.Video = Video
library.InlineSyntaxNodeContainer = InlineSyntaxNodeContainer
library.MediaSyntaxNode = MediaSyntaxNode
library.OutlineSyntaxNodeContainer = OutlineSyntaxNodeContainer
library.RevealableInlineSyntaxNode = RevealableInlineSyntaxNode
library.RevealableOutlineSyntaxNode = RevealableOutlineSyntaxNode
library.RichInlineSyntaxNode = RichInlineSyntaxNode
library.RichOutlineSyntaxNode = RichOutlineSyntaxNode

export = library
