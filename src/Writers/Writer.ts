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
import { FootnoteNode } from '../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../SyntaxNodes/FootnoteBlockNode'
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


export abstract class Writer {
  constructor(protected config: UpConfig) { }

  write(node: SyntaxNode): string {
    return this.dispatchWrite(node)
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
  protected abstract sectionSeparator(node: SectionSeparatorNode): string
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
  protected abstract footnoteReference(node: FootnoteNode): string
  protected abstract footnoteBlock(node: FootnoteBlockNode): string
  protected abstract link(node: LinkNode): string
  protected abstract image(node: ImageNode): string
  protected abstract audio(node: AudioNode): string
  protected abstract video(node: VideoNode): string
  protected abstract plainText(node: PlainTextNode): string

  protected getId(...parts: any[]): string {
    const rawId =
      [this.config.settings.documentName].concat(parts).join(' ')

    return (
      rawId
        .trim()
        .replace(/\s+/g, this.config.settings.i18n.idWordDelimiter))
  }

  private dispatchWrite(node: SyntaxNode): string {
    // TypeScript lacks multiple dispatch. Rather than polluting every single syntax node class
    // with the visitor pattern, we perform the dispatch ourselves here.

    if (node instanceof DocumentNode) {
      return this.document(node)
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

    if (node instanceof ParagraphNode) {
      return this.paragraph(node)
    }

    if (node instanceof CodeBlockNode) {
      return this.codeBlock(node)
    }

    if (node instanceof HeadingNode) {
      return this.heading(node)
    }

    if (node instanceof SectionSeparatorNode) {
      return this.sectionSeparator(node)
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

    if (node instanceof PlainTextNode) {
      return this.plainText(node)
    }

    throw new Error('Unrecognized syntax node')
  }
}
