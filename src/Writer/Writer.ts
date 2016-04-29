import { InlineSyntaxNode } from '../SyntaxNodes/InlineSyntaxNode'
import { OutlineSyntaxNode } from '../SyntaxNodes/OutlineSyntaxNode'
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
import { SpoilerNode } from '../SyntaxNodes/SpoilerNode'
import { FootnoteNode } from '../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../SyntaxNodes/FootnoteBlockNode'
import { ParagraphNode } from '../SyntaxNodes/ParagraphNode'
import { BlockquoteNode } from '../SyntaxNodes/BlockquoteNode'
import { UnorderedListNode } from '../SyntaxNodes/UnorderedListNode'
import { UnorderedListItem } from '../SyntaxNodes/UnorderedListItem'
import { OrderedListNode } from '../SyntaxNodes/OrderedListNode'
import { OrderedListItem } from '../SyntaxNodes/OrderedListItem'
import { DescriptionListNode } from '../SyntaxNodes/DescriptionListNode'
import { DescriptionListItem } from '../SyntaxNodes/DescriptionListItem'
import { DescriptionTerm } from '../SyntaxNodes/DescriptionTerm'
import { Description } from '../SyntaxNodes/Description'
import { LineBlockNode } from '../SyntaxNodes/LineBlockNode'
import { Line } from '../SyntaxNodes/Line'
import { HeadingNode } from '../SyntaxNodes/HeadingNode'
import { CodeBlockNode } from '../SyntaxNodes/CodeBlockNode'
import { SectionSeparatorNode } from '../SyntaxNodes/SectionSeparatorNode'
import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { UpConfig } from '../Up'


export abstract class Writer {
  
  constructor(public config: UpConfig) { }

  write(node: SyntaxNode): string {
    return this.dispatchWrite(node)
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

    if (node instanceof SpoilerNode) {
      return this.spoiler(node)
    }

    if (node instanceof PlainTextNode) {
      return this.plainText(node)
    }

    throw new Error("Unrecognized syntax node")
  }

  abstract document(node: DocumentNode): string;
  abstract blockquote(node: BlockquoteNode): string;
  abstract unorderedList(node: UnorderedListNode): string;
  abstract orderedList(node: OrderedListNode): string;
  abstract descriptionList(node: DescriptionListNode): string;
  abstract lineBlock(node: LineBlockNode): string;
  abstract codeBlock(node: CodeBlockNode): string;
  abstract paragraph(node: ParagraphNode): string;
  abstract heading(node: HeadingNode): string;
  abstract sectionSeparator(node: SectionSeparatorNode): string;
  abstract emphasis(node: EmphasisNode): string;
  abstract stress(node: StressNode): string;
  abstract inlineCode(node: InlineCodeNode): string;
  abstract revisionInsertion(node: RevisionInsertionNode): string;
  abstract revisionDeletion(node: RevisionDeletionNode): string;
  abstract spoiler(node: SpoilerNode): string;
  abstract footnoteReference(node: FootnoteNode): string;
  abstract footnoteBlock(node: FootnoteBlockNode): string;
  abstract link(node: LinkNode): string;
  abstract image(node: ImageNode): string;
  abstract audio(node: AudioNode): string;
  abstract video(node: VideoNode): string;
  abstract plainText(node: PlainTextNode): string;

  protected getId(...parts: string[]): string {
    const allParts = [this.config.settings.documentName].concat(parts)
    const rawId = allParts.join(' ')

    return (
      rawId
        .trim()
        .replace(/\s+/g, this.config.settings.i18n.idWordDelimiter))
  }

  protected footnoteId(referenceNumber: number): string {
    return this.getId(this.config.settings.i18n.terms.footnote, referenceNumber.toString())
  }

  protected footnoteReferenceId(referenceNumber: number): string {
    return this.getId(this.config.settings.i18n.terms.footnoteReference, referenceNumber.toString())
  }
}
