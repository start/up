import { LinkNode } from '../SyntaxNodes/LinkNode'
import { MediaSyntaxNode } from '../SyntaxNodes/MediaSyntaxNode'
import { ImageNode } from '../SyntaxNodes/ImageNode'
import { AudioNode } from '../SyntaxNodes/AudioNode'
import { VideoNode } from '../SyntaxNodes/VideoNode'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../SyntaxNodes/EmphasisNode'
import { StressNode } from '../SyntaxNodes/StressNode'
import { InlineCodeNode } from '../SyntaxNodes/InlineCodeNode'
import { RevisionInsertionNode } from '../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../SyntaxNodes/RevisionDeletionNode'
import { ParenthesizedNode } from '../SyntaxNodes/ParenthesizedNode'
import { SquareBracketedNode } from '../SyntaxNodes/SquareBracketedNode'
import { ActionNode } from '../SyntaxNodes/ActionNode'
import { HighlightNode } from '../SyntaxNodes/HighlightNode'
import { InlineSpoilerNode } from '../SyntaxNodes/InlineSpoilerNode'
import { InlineNsfwNode } from '../SyntaxNodes/InlineNsfwNode'
import { InlineNsflNode } from '../SyntaxNodes/InlineNsflNode'
import { SpoilerBlockNode } from '../SyntaxNodes/SpoilerBlockNode'
import { NsfwBlockNode } from '../SyntaxNodes/NsfwBlockNode'
import { NsflBlockNode } from '../SyntaxNodes/NsflBlockNode'
import { FootnoteNode } from '../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../SyntaxNodes/FootnoteBlockNode'
import { TableNode } from '../SyntaxNodes/TableNode'
import { ParagraphNode } from '../SyntaxNodes/ParagraphNode'
import { BlockquoteNode } from '../SyntaxNodes/BlockquoteNode'
import { UnorderedListNode } from '../SyntaxNodes/UnorderedListNode'
import { OrderedListNode } from '../SyntaxNodes/OrderedListNode'
import { DescriptionListNode } from '../SyntaxNodes/DescriptionListNode'
import { LineBlockNode } from '../SyntaxNodes/LineBlockNode'
import { HeadingNode } from '../SyntaxNodes/HeadingNode'
import { CodeBlockNode } from '../SyntaxNodes/CodeBlockNode'
import { OutlineSeparatorNode } from '../SyntaxNodes/OutlineSeparatorNode'
import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { UpConfig } from '../UpConfig'
import { SOME_WHITESPACE } from '../Parsing/PatternPieces'
import { patternIgnoringCapitalizationAndStartingWith, either } from '../Parsing/PatternHelpers'


// This class provides dyanmic dispatch for writing every type of syntax node.
//
// Additionally, it provides access to the following goodies throughout the entire writing
// process:
//
// 1. The provided configuration settings
// 2. The document syntax node and its table of contents
// 3. An easy way to generate unique IDs using the provided configuration settings
//
// Writers are designed to be single use, so a new instance must be created every time a new
// document is written. This makes it a bit simpler to write concrete writer classes, because
// they don't have to worry about resetting any counters.
export abstract class Writer {
  private _result: string

  constructor(
    protected document: DocumentNode,
    protected config: UpConfig) { }

  get result(): string {
    this._result =
      this._result || this.writeDocument(this.document)

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
    const { settings } = this.config

    const rawIdWithAllParts =
      [settings.documentName, ...parts].join(' ')

    return rawIdWithAllParts
      .trim()
      .replace(WHITESPACE_PATTERN, settings.i18n.wordDelimiterForGeneratedIds)
  }

  protected abstract writeDocument(document: DocumentNode): string

  protected abstract action(action: ActionNode): string
  protected abstract audio(audio: AudioNode): string
  protected abstract blockquote(blockquote: BlockquoteNode): string
  protected abstract codeBlock(codeBlock: CodeBlockNode): string
  protected abstract descriptionList(list: DescriptionListNode): string
  protected abstract emphasis(emphasis: EmphasisNode): string
  protected abstract footnoteBlock(footnoteBlock: FootnoteBlockNode): string
  protected abstract footnoteReference(footnote: FootnoteNode): string
  protected abstract heading(heading: HeadingNode): string
  protected abstract highlight(highlight: HighlightNode): string
  protected abstract image(image: ImageNode): string
  protected abstract inlineCode(inlineCode: InlineCodeNode): string
  protected abstract inlineNsfl(inlineNsfl: InlineNsflNode): string
  protected abstract inlineNsfw(inlineNsfw: InlineNsfwNode): string
  protected abstract inlineSpoiler(inlineSpoiler: InlineSpoilerNode): string
  protected abstract lineBlock(lineBlock: LineBlockNode): string
  protected abstract link(link: LinkNode): string
  protected abstract nsflBlock(nsflBlock: NsflBlockNode): string
  protected abstract nsfwBlock(nsfwBlock: NsfwBlockNode): string
  protected abstract orderedList(list: OrderedListNode): string
  protected abstract outlineSeparator(separator: OutlineSeparatorNode): string
  protected abstract paragraph(paragraph: ParagraphNode): string
  protected abstract parenthesized(parenthesized: ParenthesizedNode): string
  protected abstract plainText(plainText: PlainTextNode): string
  protected abstract revisionDeletion(revisionDeletion: RevisionDeletionNode): string
  protected abstract revisionInsertion(revisionInsertion: RevisionInsertionNode): string
  protected abstract spoilerBlock(spoilerBlock: SpoilerBlockNode): string
  protected abstract squareBracketed(squareBracketed: SquareBracketedNode): string
  protected abstract stress(stress: StressNode): string
  protected abstract table(table: TableNode): string
  protected abstract unorderedList(list: UnorderedListNode): string
  protected abstract video(video: VideoNode): string

  private dispatchWrite(node: SyntaxNode): string {
    // TypeScript lacks multiple dispatch. Rather than polluting every single syntax node class
    // with the visitor pattern, we perform the dispatch ourselves here.

    if (node instanceof PlainTextNode) {
      return this.plainText(node)
    }

    if (node instanceof LinkNode) {
      return (
        this.isUrlAllowed(node.url)
          ? this.link(node)
          : this.writeAll(node.children))
    }

    if (node instanceof ParagraphNode) {
      return this.paragraph(node)
    }

    if (node instanceof BlockquoteNode) {
      return this.blockquote(node)
    }

    if (node instanceof UnorderedListNode) {
      return this.unorderedList(node)
    }

    if (node instanceof OrderedListNode) {
      return this.orderedList(node)
    }

    if (node instanceof DescriptionListNode) {
      return this.descriptionList(node)
    }

    if (node instanceof LineBlockNode) {
      return this.lineBlock(node)
    }

    if (node instanceof CodeBlockNode) {
      return this.codeBlock(node)
    }

    if (node instanceof HeadingNode) {
      return this.heading(node)
    }

    if (node instanceof OutlineSeparatorNode) {
      return this.outlineSeparator(node)
    }

    if (node instanceof EmphasisNode) {
      return this.emphasis(node)
    }

    if (node instanceof StressNode) {
      return this.stress(node)
    }

    if (node instanceof InlineCodeNode) {
      return this.inlineCode(node)
    }

    if (node instanceof FootnoteNode) {
      return this.footnoteReference(node)
    }

    if (node instanceof FootnoteBlockNode) {
      return this.footnoteBlock(node)
    }

    if (node instanceof TableNode) {
      return this.table(node)
    }

    if (node instanceof MediaSyntaxNode) {
      return this.writeIfUrlIsAllowed(node)
    }

    if (node instanceof RevisionDeletionNode) {
      return this.revisionDeletion(node)
    }

    if (node instanceof RevisionInsertionNode) {
      return this.revisionInsertion(node)
    }

    if (node instanceof ParenthesizedNode) {
      return this.parenthesized(node)
    }

    if (node instanceof SquareBracketedNode) {
      return this.squareBracketed(node)
    }

    if (node instanceof ActionNode) {
      return this.action(node)
    }

    if (node instanceof HighlightNode) {
      return this.highlight(node)
    }

    if (node instanceof InlineSpoilerNode) {
      return this.inlineSpoiler(node)
    }

    if (node instanceof InlineNsfwNode) {
      return this.inlineNsfw(node)
    }

    if (node instanceof InlineNsflNode) {
      return this.inlineNsfl(node)
    }

    if (node instanceof SpoilerBlockNode) {
      return this.spoilerBlock(node)
    }

    if (node instanceof NsfwBlockNode) {
      return this.nsfwBlock(node)
    }

    if (node instanceof NsflBlockNode) {
      return this.nsflBlock(node)
    }

    throw new Error('Unrecognized syntax node')
  }

  private writeIfUrlIsAllowed(media: MediaSyntaxNode): string {
    if (!this.isUrlAllowed(media.url)) {
      return ''
    }

    if (media instanceof ImageNode) {
      return this.image(media)
    }

    if (media instanceof AudioNode) {
      return this.audio(media)
    }

    if (media instanceof VideoNode) {
      return this.video(media)
    }

    throw new Error('Unrecognized media syntax node')
  }

  private isUrlAllowed(url: string): boolean {
    return this.config.settings.writeUnsafeContent || !UNSAFE_URL_SCHEME.test(url)
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
