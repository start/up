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
import { SectionSeparatorNode } from '../SyntaxNodes/SectionSeparatorNode'
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
    protected documentNode: DocumentNode,
    protected config: UpConfig) { }

  get result(): string {
    this._result =
      this._result || this.document(this.documentNode)

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

  protected abstract document(node: DocumentNode): string
  protected abstract blockquote(node: BlockquoteNode): string
  protected abstract unorderedList(node: UnorderedListNode): string
  protected abstract orderedList(node: OrderedListNode): string
  protected abstract descriptionList(node: DescriptionListNode): string
  protected abstract lineBlock(node: LineBlockNode): string
  protected abstract codeBlock(node: CodeBlockNode): string
  protected abstract paragraph(node: ParagraphNode): string
  protected abstract heading(node: HeadingNode): string
  protected abstract sectionSeparator(): string
  protected abstract emphasis(node: EmphasisNode): string
  protected abstract stress(node: StressNode): string
  protected abstract inlineCode(node: InlineCodeNode): string
  protected abstract revisionInsertion(node: RevisionInsertionNode): string
  protected abstract revisionDeletion(node: RevisionDeletionNode): string
  protected abstract parenthesized(node: ParenthesizedNode): string
  protected abstract squareBracketed(node: SquareBracketedNode): string
  protected abstract action(node: ActionNode): string
  protected abstract inlineSpoiler(node: InlineSpoilerNode): string
  protected abstract inlineNsfw(node: InlineNsfwNode): string
  protected abstract inlineNsfl(node: InlineNsflNode): string
  protected abstract spoilerBlock(node: SpoilerBlockNode): string
  protected abstract nsfwBlock(node: NsfwBlockNode): string
  protected abstract nsflBlock(node: NsflBlockNode): string
  protected abstract footnoteReference(node: FootnoteNode): string
  protected abstract footnoteBlock(node: FootnoteBlockNode): string
  protected abstract table(node: TableNode): string
  protected abstract link(node: LinkNode): string
  protected abstract image(node: ImageNode): string
  protected abstract audio(node: AudioNode): string
  protected abstract video(node: VideoNode): string
  protected abstract plainText(node: PlainTextNode): string

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

    if (node instanceof SectionSeparatorNode) {
      return this.sectionSeparator()
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
