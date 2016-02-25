/*
import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'
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
import { BulletedListItemNode } from '../SyntaxNodes/BulletedListItemNode'
import { LineBlockNode } from '../SyntaxNodes/LineBlockNode'
import { LineNode } from '../SyntaxNodes/LineNode'
import { HeadingNode } from '../SyntaxNodes/HeadingNode'
import { CodeBlockNode } from '../SyntaxNodes/CodeBlockNode'
import { SectionSeparatorNode } from '../SyntaxNodes/SectionSeparatorNode'
import { Writer } from './Writer'

export class HtmlWriter extends Writer{
  writeDocument(node: DocumentNode): string {
    return this.writeChildren(node)
  }
  
  writeBlockquote(node: BlockquoteNode): string {
    return this.writeTagAndChildren('blockquote', node)
  }
  
  writeBulletedList(node: BulletedListNode): string {
    return this.writeTagAndChildren('ul', node)
  }
  
  writeBulletedListItem(node: BulletedListItemNode): string {
    return this.writeTagAndChildren('li', node)
  }
  
  writeLineBlock(node: LineBlockNode): string {
    return this.writeChildren(node)
  }
  
  writeCodeBlock(node: CodeBlockNode): string;
  writeParagraph(node: ParagraphNode): string;
  writeLineNode(node: LineNode): string;
  writeHeading(node: HeadingNode): string;
  writeEmphasis(node: EmphasisNode): string;
  writeStress(node: StressNode): string;
  writeInlineCode(node: InlineCodeNode): string;
  writeRevisionInsertion(node: RevisionInsertionNode): string;
  writeRevisionDeletion(node: RevisionDeletionNode): string;
  writeSpoiler(node: SpoilerNode): string;
  writeInlineAside(node: InlineAsideNode): string;
  writeLink(node: LinkNode): string;
  
  writeTagAndChildren(tagName: string, node: RichSyntaxNode): string {
    return `<${tagName}>${this.writeChildren(node)}</${tagName}>`
  }
  
  writeTagAndTextContent
  
  writeChildren(node: RichSyntaxNode): string {
    return node.children.reduce(
      (html, child) => html + this.write(child),
      '')
  }
}

*/