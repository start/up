import { UpDocument } from '../SyntaxNodes/UpDocument'
import { InlineUpDocument } from '../SyntaxNodes/InlineUpDocument'
import { Link } from '../SyntaxNodes/Link'
import { MediaSyntaxNode } from '../SyntaxNodes/MediaSyntaxNode'
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
import { OutlineSeparator } from '../SyntaxNodes/OutlineSeparator'
import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { OutlineSyntaxNode } from '../SyntaxNodes/OutlineSyntaxNode'
import { Config } from '../Config'
import { SOME_WHITESPACE } from '../Parsing/PatternPieces'
import { patternIgnoringCapitalizationAndStartingWith, either } from '../Parsing/PatternHelpers'


export type EitherTypeOfUpDocument = UpDocument | InlineUpDocument

// This class provides dyanmic dispatch for writing every type of syntax node.
//
// Additionally, it provides access to the following goodies throughout the entire writing
// process:
//
// 1. The provided configuration settings
// 2. An easy way to generate unique IDs using the provided configuration settings
//
// Writers are designed to be single-use, so a new instance must be created every time a new
// document is written. This makes it a bit simpler to write concrete writer classes, because
// they don't have to worry about resetting any counters.
export abstract class Writer {
  private _result: string

  constructor(
    private document: EitherTypeOfUpDocument,
    protected config: Config
  ) { }

  get result(): string {
    this._result =
      this._result || this.writeEitherTypeOfDocument(this.document)

    return this._result
  }

  protected write(node: SyntaxNode): string {
    return this.dispatchWrite(node)
  }

  protected writeEach(nodes: SyntaxNode[]): string[] {
    return nodes.map(node => this.write(node))
  }

  protected writeAll(nodes: SyntaxNode[]): string {
    return this.writeEach(nodes).join('')
  }

  protected getId(...parts: any[]): string {
    const rawIdWithAllParts =
      [this.config.documentName, ...parts].join(' ')

    return rawIdWithAllParts
      .trim()
      .replace(WHITESPACE_PATTERN, '-')
  }

  protected abstract writeDocument(document: EitherTypeOfUpDocument): string
  protected abstract writeInlineDocument(inlineDocument: InlineUpDocument): string

  protected abstract audio(audio: Audio): string
  protected abstract bold(bold: Bold): string
  protected abstract blockquote(blockquote: Blockquote): string
  protected abstract codeBlock(codeBlock: CodeBlock): string
  protected abstract descriptionList(list: DescriptionList): string
  protected abstract emphasis(emphasis: Emphasis): string
  protected abstract exampleInput(exampleInput: ExampleInput): string
  protected abstract footnoteBlock(footnoteBlock: FootnoteBlock): string
  protected abstract footnoteReference(footnote: Footnote): string
  protected abstract heading(heading: Heading, ordinalOfEntryInTableOfContents?: number): string
  protected abstract highlight(highlight: Highlight): string
  protected abstract image(image: Image): string
  protected abstract inlineCode(inlineCode: InlineCode): string
  protected abstract inlineNsfl(inlineNsfl: InlineNsfl): string
  protected abstract inlineNsfw(inlineNsfw: InlineNsfw): string
  protected abstract inlineSpoiler(inlineSpoiler: InlineSpoiler): string
  protected abstract italic(italic: Italic): string
  protected abstract lineBlock(lineBlock: LineBlock): string
  protected abstract link(link: Link): string
  protected abstract nsflBlock(nsflBlock: NsflBlock): string
  protected abstract nsfwBlock(nsfwBlock: NsfwBlock): string
  protected abstract orderedList(list: OrderedList): string
  protected abstract outlineSeparator(separator: OutlineSeparator): string
  protected abstract paragraph(paragraph: Paragraph): string
  protected abstract normalParenthetical(normalParenthetical: NormalParenthetical): string
  protected abstract plainText(plainText: PlainText): string
  protected abstract revisionDeletion(revisionDeletion: RevisionDeletion): string
  protected abstract revisionInsertion(revisionInsertion: RevisionInsertion): string
  protected abstract spoilerBlock(spoilerBlock: SpoilerBlock): string
  protected abstract squareParenthetical(squareParenthetical: SquareParenthetical): string
  protected abstract stress(stress: Stress): string
  protected abstract table(table: Table, ordinalOfEntryInTableOfContents?: number): string
  protected abstract unorderedList(list: UnorderedList): string
  protected abstract video(video: Video): string

  private writeEitherTypeOfDocument(document: EitherTypeOfUpDocument): string {
    return (
      document instanceof UpDocument
        ? this.writeDocument(document)
        : this.writeInlineDocument(document))
  }

  private dispatchWrite(node: SyntaxNode): string {
    // TypeScript lacks multiple dispatch. Rather than polluting every single syntax node class
    // with the visitor pattern, we perform the dispatch ourselves here.

    if (node instanceof PlainText) {
      return this.plainText(node)
    }

    if (node instanceof Link) {
      return (
        this.isUrlAllowed(node.url)
          ? this.link(node)
          : this.writeAll(node.children))
    }

    if (node instanceof Paragraph) {
      return this.paragraph(node)
    }

    if (node instanceof Heading) {
      return this.heading(node, this.getOrdinalOfEntryInTableOfContents(node))
    }

    if (node instanceof Table) {
      return this.table(node, this.getOrdinalOfEntryInTableOfContents(node))
    }

    if (node instanceof Blockquote) {
      return this.blockquote(node)
    }

    if (node instanceof UnorderedList) {
      return this.unorderedList(node)
    }

    if (node instanceof OrderedList) {
      return this.orderedList(node)
    }

    if (node instanceof DescriptionList) {
      return this.descriptionList(node)
    }

    if (node instanceof LineBlock) {
      return this.lineBlock(node)
    }

    if (node instanceof CodeBlock) {
      return this.codeBlock(node)
    }

    if (node instanceof OutlineSeparator) {
      return this.outlineSeparator(node)
    }

    if (node instanceof Emphasis) {
      return this.emphasis(node)
    }

    if (node instanceof Stress) {
      return this.stress(node)
    }

    if (node instanceof Italic) {
      return this.italic(node)
    }

    if (node instanceof Bold) {
      return this.bold(node)
    }

    if (node instanceof InlineCode) {
      return this.inlineCode(node)
    }

    if (node instanceof ExampleInput) {
      return this.exampleInput(node)
    }

    if (node instanceof Footnote) {
      return this.footnoteReference(node)
    }

    if (node instanceof FootnoteBlock) {
      return this.footnoteBlock(node)
    }

    if (node instanceof MediaSyntaxNode) {
      return this.writeIfUrlIsAllowed(node)
    }

    if (node instanceof RevisionDeletion) {
      return this.revisionDeletion(node)
    }

    if (node instanceof RevisionInsertion) {
      return this.revisionInsertion(node)
    }

    if (node instanceof NormalParenthetical) {
      return this.normalParenthetical(node)
    }

    if (node instanceof SquareParenthetical) {
      return this.squareParenthetical(node)
    }

    if (node instanceof Highlight) {
      return this.highlight(node)
    }

    if (node instanceof InlineSpoiler) {
      return this.inlineSpoiler(node)
    }

    if (node instanceof InlineNsfw) {
      return this.inlineNsfw(node)
    }

    if (node instanceof InlineNsfl) {
      return this.inlineNsfl(node)
    }

    if (node instanceof SpoilerBlock) {
      return this.spoilerBlock(node)
    }

    if (node instanceof NsfwBlock) {
      return this.nsfwBlock(node)
    }

    if (node instanceof NsflBlock) {
      return this.nsflBlock(node)
    }

    throw new Error('Unrecognized syntax node')
  }

  private writeIfUrlIsAllowed(media: MediaSyntaxNode): string {
    if (!this.isUrlAllowed(media.url)) {
      return ''
    }

    if (media instanceof Image) {
      return this.image(media)
    }

    if (media instanceof Audio) {
      return this.audio(media)
    }

    if (media instanceof Video) {
      return this.video(media)
    }

    throw new Error('Unrecognized media syntax node')
  }

  private isUrlAllowed(url: string): boolean {
    return this.config.writeUnsafeContent || !UNSAFE_URL_SCHEME.test(url)
  }

  // Returns the ordinal (1-based!) of an outline syntax node's entry in the table of contents.
  //
  // Returns null if there isn't an entry in the table of contents for the node.  
  private getOrdinalOfEntryInTableOfContents(node: OutlineSyntaxNode): number {
    const { document } = this

    if ((document instanceof UpDocument) && document.tableOfContents) {
      const indexOfEntry =
        document.tableOfContents.entries.indexOf(node)

      return (indexOfEntry >= 0) ? (indexOfEntry + 1) : null
    }

    return null
  }
}


const WHITESPACE_PATTERN = new RegExp(SOME_WHITESPACE, 'g')

const UNSAFE_URL_SCHEME =
  patternIgnoringCapitalizationAndStartingWith(
    either(
      'javascript',
      'data',
      'file',
      'vbscript'
    ) + ':')
