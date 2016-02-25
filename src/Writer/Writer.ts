
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
import { BulletedListNode } from '../SyntaxNodes/BulletedListNode'
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
      return this.writeDocument(node)
    }
    
    if (node instanceof BlockquoteNode) {
      return this.writeBlockquote(node)
    }
    
    if (node instanceof BulletedListNode) {
      return this.writeBulletedList(node)
    }
    
    if (node instanceof LineBlockNode) {
      return this.writeLineBlock(node)
    }
    
    if (node instanceof LineNode) {
      return this.writeLineNode(node)
    }
    
    if (node instanceof ParagraphNode) {
      return this.writeParagraph(node)
    }
    
    if (node instanceof CodeBlockNode) {
      return this.writeCodeBlock(node)
    }
    
    if (node instanceof HeadingNode) {
      return this.writeHeading(node)
    }
    
    if (node instanceof EmphasisNode) {
      return this.writeEmphasis(node)
    }
    
    if (node instanceof StressNode) {
      return this.writeStress(node)
    }
    
    if (node instanceof InlineCodeNode) {
      return this.writeInlineCode(node)
    }
    
    if (node instanceof InlineAsideNode) {
      return this.writeInlineAside(node)
    }
    
    if (node instanceof LinkNode) {
      return this.writeLink(node)
    }
    
    if (node instanceof RevisionDeletionNode) {
      return this.writeRevisionDeletion(node)
    }
    
    if (node instanceof RevisionInsertionNode) {
      return this.writeRevisionInsertion(node)
    }
  }
  
  abstract writeDocument(node: DocumentNode): string;
  abstract writeBlockquote(node: BlockquoteNode): string;
  abstract writeBulletedList(node: BulletedListNode): string;
  abstract writeLineBlock(node: LineBlockNode): string;
  abstract writeCodeBlock(node: CodeBlockNode): string;
  abstract writeParagraph(node: ParagraphNode): string;
  abstract writeLineNode(node: LineNode): string;
  abstract writeHeading(node: HeadingNode): string;
  abstract writeEmphasis(node: EmphasisNode): string;
  abstract writeStress(node: StressNode): string;
  abstract writeInlineCode(node: InlineCodeNode): string;
  abstract writeRevisionInsertion(node: RevisionInsertionNode): string;
  abstract writeRevisionDeletion(node: RevisionDeletionNode): string;
  abstract writeSpoiler(node: SpoilerNode): string;
  abstract writeInlineAside(node: InlineAsideNode): string;
  abstract writeLink(node: LinkNode): string;
}