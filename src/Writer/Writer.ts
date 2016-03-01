
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
import { UnorderedListItemNode } from '../SyntaxNodes/UnorderedListItemNode'
import { NumberedListNode } from '../SyntaxNodes/NumberedListNode'
import { NumberedListItemNode } from '../SyntaxNodes/NumberedListItemNode'
import { LineBlockNode } from '../SyntaxNodes/LineBlockNode'
import { LineNode } from '../SyntaxNodes/LineNode'
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
    
    if (node instanceof UnorderedListItemNode) {
      return this.unorderedListItem(node)
    }
    
    if (node instanceof NumberedListNode) {
      return this.numberedList(node)
    }
    
    if (node instanceof NumberedListItemNode) {
      return this.numberedListItem(node)
    }
    
    if (node instanceof LineBlockNode) {
      return this.lineBlock(node)
    }
    
    if (node instanceof LineNode) {
      return this.line(node)
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
  abstract unorderedListItem(node: UnorderedListItemNode): string;
  abstract numberedList(node: NumberedListNode): string;
  abstract numberedListItem(node: NumberedListItemNode): string;
  abstract lineBlock(node: LineBlockNode): string;
  abstract line(node: LineNode): string;
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