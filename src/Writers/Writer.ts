import { LinkNode } from '../SyntaxNodes/LinkNode'
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


export abstract class Writer<TResult> {
  constructor(
    protected documentNode: DocumentNode,
    protected config: UpConfig) { }

  result(): TResult {
    return this.document(this.documentNode)
  }

  protected write(node: SyntaxNode): TResult {
    return this.dispatchWrite(node)
  }

  protected abstract document(node: DocumentNode): TResult
  protected abstract blockquote(node: BlockquoteNode): TResult
  protected abstract unorderedList(node: UnorderedListNode): TResult
  protected abstract orderedList(node: OrderedListNode): TResult
  protected abstract descriptionList(node: DescriptionListNode): TResult
  protected abstract lineBlock(node: LineBlockNode): TResult
  protected abstract codeBlock(node: CodeBlockNode): TResult
  protected abstract paragraph(node: ParagraphNode): TResult
  protected abstract heading(node: HeadingNode): TResult
  protected abstract sectionSeparator(): TResult
  protected abstract emphasis(node: EmphasisNode): TResult
  protected abstract stress(node: StressNode): TResult
  protected abstract inlineCode(node: InlineCodeNode): TResult
  protected abstract revisionInsertion(node: RevisionInsertionNode): TResult
  protected abstract revisionDeletion(node: RevisionDeletionNode): TResult
  protected abstract parenthesized(node: ParenthesizedNode): TResult
  protected abstract squareBracketed(node: SquareBracketedNode): TResult
  protected abstract action(node: ActionNode): TResult
  protected abstract inlineSpoiler(node: InlineSpoilerNode): TResult
  protected abstract inlineNsfw(node: InlineNsfwNode): TResult
  protected abstract inlineNsfl(node: InlineNsflNode): TResult
  protected abstract spoilerBlock(node: SpoilerBlockNode): TResult
  protected abstract nsfwBlock(node: NsfwBlockNode): TResult
  protected abstract nsflBlock(node: NsflBlockNode): TResult
  protected abstract footnoteReference(node: FootnoteNode): TResult
  protected abstract footnoteBlock(node: FootnoteBlockNode): TResult
  protected abstract table(node: TableNode): TResult
  protected abstract link(node: LinkNode): TResult
  protected abstract image(node: ImageNode): TResult
  protected abstract audio(node: AudioNode): TResult
  protected abstract video(node: VideoNode): TResult
  protected abstract plainText(node: PlainTextNode): TResult

  protected getId(...parts: any[]): string {
    const { settings } = this.config

    const rawIdWithAllParts =
      [settings.documentName, ...parts].join(' ')

    return rawIdWithAllParts
      .trim()
      .replace(WHITESPACE_PATTERN, settings.i18n.idWordDelimiter)
  }

  private dispatchWrite(node: SyntaxNode): TResult {
    // TypeScript lacks multiple dispatch. Rather than polluting every single syntax node class
    // with the visitor pattern, we perform the dispatch ourselves here.

    if (node instanceof PlainTextNode) {
      return this.plainText(node)
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

    if (node instanceof LinkNode) {
      return this.link(node)
    }

    if (node instanceof ImageNode) {
      return this.image(node)
    }

    if (node instanceof AudioNode) {
      return this.audio(node)
    }

    if (node instanceof VideoNode) {
      return this.video(node)
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
}


const WHITESPACE_PATTERN = new RegExp(SOME_WHITESPACE, 'g')
