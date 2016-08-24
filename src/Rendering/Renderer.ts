import { UpDocument } from '../SyntaxNodes/UpDocument'
import { InlineUpDocument } from '../SyntaxNodes/InlineUpDocument'
import { Link } from '../SyntaxNodes/Link'
import { Image } from '../SyntaxNodes/Image'
import { Audio } from '../SyntaxNodes/Audio'
import { Video } from '../SyntaxNodes/Video'
import { PlainText } from '../SyntaxNodes/PlainText'
import { Emphasis } from '../SyntaxNodes/Emphasis'
import { ExampleInput } from '../SyntaxNodes/ExampleInput'
import { Stress } from '../SyntaxNodes/Stress'
import { Italic } from '../SyntaxNodes/Italic'
import { Bold } from '../SyntaxNodes/Bold'
import { InlineCode } from '../SyntaxNodes/InlineCode'
import { ReferenceToTableOfContentsEntry } from '../SyntaxNodes/ReferenceToTableOfContentsEntry'
import { RevisionInsertion } from '../SyntaxNodes/RevisionInsertion'
import { RevisionDeletion } from '../SyntaxNodes/RevisionDeletion'
import { NormalParenthetical } from '../SyntaxNodes/NormalParenthetical'
import { SquareParenthetical } from '../SyntaxNodes/SquareParenthetical'
import { Highlight } from '../SyntaxNodes/Highlight'
import { InlineSpoiler } from '../SyntaxNodes/InlineSpoiler'
import { InlineNsfw } from '../SyntaxNodes/InlineNsfw'
import { InlineNsfl } from '../SyntaxNodes/InlineNsfl'
import { SpoilerBlock } from '../SyntaxNodes/SpoilerBlock'
import { NsfwBlock } from '../SyntaxNodes/NsfwBlock'
import { NsflBlock } from '../SyntaxNodes/NsflBlock'
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
import { Config } from '../Config'
import { SOME_WHITESPACE } from '../Parsing/PatternPieces'


export type EitherTypeOfUpDocument = UpDocument | InlineUpDocument

// Writers are designed to be single-use, so a new instance must be created every time a new
// document is written. This makes it a bit simpler to write concrete renderer classes, because
// they don't have to worry about resetting any counters.
export abstract class Renderer {
  private _result: string

  constructor(
    private document: EitherTypeOfUpDocument,
    protected config: Config) { }

  get result(): string {
    this._result =
      this._result || this.writeEitherTypeOfDocument(this.document)

    return this._result
  }

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
  abstract inlineNsfl(inlineNsfl: InlineNsfl): string
  abstract inlineNsfw(inlineNsfw: InlineNsfw): string
  abstract inlineSpoiler(inlineSpoiler: InlineSpoiler): string
  abstract italic(italic: Italic): string
  abstract lineBlock(lineBlock: LineBlock): string
  abstract link(link: Link): string
  abstract nsflBlock(nsflBlock: NsflBlock): string
  abstract nsfwBlock(nsfwBlock: NsfwBlock): string
  abstract orderedList(list: OrderedList): string
  abstract thematicBreak(thematicBreak: ThematicBreak): string
  abstract paragraph(paragraph: Paragraph): string
  abstract normalParenthetical(normalParenthetical: NormalParenthetical): string
  abstract plainText(plainText: PlainText): string
  abstract referenceToTableOfContentsEntry(reference: ReferenceToTableOfContentsEntry): string
  abstract revisionDeletion(revisionDeletion: RevisionDeletion): string
  abstract revisionInsertion(revisionInsertion: RevisionInsertion): string
  abstract spoilerBlock(spoilerBlock: SpoilerBlock): string
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

  protected getId(...parts: any[]): string {
    const rawIdWithAllParts =
      [this.config.idPrefix, ...parts].join(' ')

    return rawIdWithAllParts
      .trim()
      .replace(WHITESPACE_PATTERN, '-')
  }

  protected abstract renderDocument(document: EitherTypeOfUpDocument): string
  protected abstract renderInlineDocument(inlineDocument: InlineUpDocument): string

  private writeEitherTypeOfDocument(document: EitherTypeOfUpDocument): string {
    return (
      document instanceof UpDocument
        ? this.renderDocument(document)
        : this.renderInlineDocument(document))
  }
}


const WHITESPACE_PATTERN = new RegExp(SOME_WHITESPACE, 'g')
