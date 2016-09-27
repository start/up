import { Document } from '../SyntaxNodes/Document'
import { InlineDocument } from '../SyntaxNodes/InlineDocument'
import { Link } from '../SyntaxNodes/Link'
import { Image } from '../SyntaxNodes/Image'
import { Audio } from '../SyntaxNodes/Audio'
import { Video } from '../SyntaxNodes/Video'
import { Text } from '../SyntaxNodes/Text'
import { Emphasis } from '../SyntaxNodes/Emphasis'
import { ExampleInput } from '../SyntaxNodes/ExampleInput'
import { Stress } from '../SyntaxNodes/Stress'
import { Italics } from '../SyntaxNodes/Italics'
import { Bold } from '../SyntaxNodes/Bold'
import { InlineCode } from '../SyntaxNodes/InlineCode'
import { SectionLink } from '../SyntaxNodes/SectionLink'
import { NormalParenthetical } from '../SyntaxNodes/NormalParenthetical'
import { SquareParenthetical } from '../SyntaxNodes/SquareParenthetical'
import { Highlight } from '../SyntaxNodes/Highlight'
import { InlineRevealable } from '../SyntaxNodes/InlineRevealable'
import { OutlineRevealable } from '../SyntaxNodes/OutlineRevealable'
import { InlineQuote } from '../SyntaxNodes/InlineQuote'
import { Footnote } from '../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../SyntaxNodes/FootnoteBlock'
import { Table } from '../SyntaxNodes/Table'
import { Paragraph } from '../SyntaxNodes/Paragraph'
import { Blockquote } from '../SyntaxNodes/Blockquote'
import { UnorderedList } from '../SyntaxNodes/UnorderedList'
import { OrderedList } from '../SyntaxNodes/OrderedList'
import { DescriptionList } from '../SyntaxNodes/DescriptionList'
import { LineBlock } from '../SyntaxNodes/LineBlock'
import { Heading } from '../SyntaxNodes/Heading'
import { CodeBlock } from '../SyntaxNodes/CodeBlock'
import { ThematicBreak } from '../SyntaxNodes/ThematicBreak'
import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { Settings } from '../Settings'
import { SOME_WHITESPACE } from '../PatternPieces'


export abstract class Renderer {
  constructor(protected settings: Settings.Rendering) { }

  abstract renderDocument(document: Document): string
  abstract renderInlineDocument(inlineDocument: InlineDocument): string
  abstract renderTableOfContents(tableOfContents: Document.TableOfContents): string

  // Ideally, the following abstract methods wouldn't be public! But for the purpose of
  // double dispatch, they need to be exposed to our syntax node classes. 

  abstract audio(audio: Audio): string
  abstract bold(bold: Bold): string
  abstract blockquote(blockquote: Blockquote): string
  abstract codeBlock(codeBlock: CodeBlock): string
  abstract descriptionList(list: DescriptionList): string
  abstract emphasis(emphasis: Emphasis): string
  abstract exampleInput(exampleInput: ExampleInput): string
  abstract footnoteBlock(footnoteBlock: FootnoteBlock): string
  abstract referenceToFootnote(footnote: Footnote): string
  abstract heading(heading: Heading): string
  abstract highlight(highlight: Highlight): string
  abstract image(image: Image): string
  abstract inlineCode(inlineCode: InlineCode): string
  abstract inlineQuote(inlineQuote: InlineQuote): string
  abstract italics(italics: Italics): string
  abstract lineBlock(lineBlock: LineBlock): string
  abstract link(link: Link): string
  abstract orderedList(list: OrderedList): string
  abstract thematicBreak(thematicBreak: ThematicBreak): string
  abstract paragraph(paragraph: Paragraph): string
  abstract normalParenthetical(normalParenthetical: NormalParenthetical): string
  abstract text(text: Text): string
  abstract inlineRevealable(inlineRevealable: InlineRevealable): string
  abstract outlineRevealable(outlineRevealable: OutlineRevealable): string
  abstract sectionLink(sectionLink: SectionLink): string
  abstract squareParenthetical(squareParenthetical: SquareParenthetical): string
  abstract stress(stress: Stress): string
  abstract table(table: Table): string
  abstract unorderedList(list: UnorderedList): string
  abstract video(video: Video): string

  protected renderEach(nodes: SyntaxNode[]): string[] {
    return nodes.map(node => node.render(this))
  }

  protected renderAll(nodes: SyntaxNode[]): string {
    return this.renderEach(nodes).join('')
  }

  protected idFor(...parts: any[]): string {
    const rawId =
      [this.settings.idPrefix, ...parts].join(' ')

    return rawId
      .trim()
      .replace(WHITESPACE_PATTERN, '-')
  }
}


const WHITESPACE_PATTERN = new RegExp(SOME_WHITESPACE, 'g')
