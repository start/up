import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { LinkNode } from '../SyntaxNodes/LinkNode'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../SyntaxNodes/EmphasisNode'
import { StressNode } from '../SyntaxNodes/StressNode'
import { InlineCodeNode } from '../SyntaxNodes/InlineCodeNode'
import { RevisionInsertionNode } from '../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../SyntaxNodes/RevisionDeletionNode'
import { SpoilerNode } from '../SyntaxNodes/SpoilerNode'
import { InlineAsideNode } from '../SyntaxNodes/InlineAsideNode'
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

export abstract class Writer {
  
  write(node: SyntaxNode) {
    
    // TypeScript lacks multiple dispatch. Rather than polluting every single SyntaxNode class
    // with the visitor pattern, it's cleaner to perform the dispatch ourselves here.
     
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
    
    if (node instanceof EmphasisNode) {
      return this.emphasis(node)
    }
    
    if (node instanceof StressNode) {
      return this.stress(node)
    }
    
    if (node instanceof InlineCodeNode) {
      return this.inlineCode(node)
    }
    
    if (node instanceof InlineAsideNode) {
      return this.inlineAside(node)
    }
    
    if (node instanceof LinkNode) {
      return this.link(node)
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
  abstract emphasis(node: EmphasisNode): string;
  abstract stress(node: StressNode): string;
  abstract inlineCode(node: InlineCodeNode): string;
  abstract revisionInsertion(node: RevisionInsertionNode): string;
  abstract revisionDeletion(node: RevisionDeletionNode): string;
  abstract spoiler(node: SpoilerNode): string;
  abstract inlineAside(node: InlineAsideNode): string;
  abstract link(node: LinkNode): string;
  abstract plainText(node: PlainTextNode): string;
}