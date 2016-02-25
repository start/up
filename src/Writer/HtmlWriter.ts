 
import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode' 
import { TextSyntaxNode } from '../SyntaxNodes/TextSyntaxNode'
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
    return this.htmlNodes(node.children)
  }
  
  writeBlockquote(node: BlockquoteNode): string {
    return this.htmlNode('blockquote', node)
  }
  
  writeBulletedList(node: BulletedListNode): string {
    return this.htmlNode('ul', node)
  }
  
  writeBulletedListItem(node: BulletedListItemNode): string {
    return this.htmlNode('li', node)
  }
  
  writeLineBlock(node: LineBlockNode): string {
    return this.htmlNodes(node.children)
  }
  
  writeLine(node: LineNode): string {
    return this.htmlNode('div', node)
  }
  
  writeCodeBlock(node: CodeBlockNode): string {
    return htmlNode('pre', htmlNode('code', node.text))
  }
  
  writeParagraph(node: ParagraphNode): string {
    return this.htmlNode('p', node)
  }
  
  writeHeading(node: HeadingNode): string{
    return this.htmlNode('h' + node.level, node)
  }
  
  writeEmphasis(node: EmphasisNode): string {
    return this.htmlNode('em', node)
  }
  
  writeStress(node: StressNode): string {
    return this.htmlNode('strong', node)
  }
  
  writeInlineCode(node: InlineCodeNode): string {
    return htmlNode('code', node.text)
  }
  
  writeRevisionInsertion(node: RevisionInsertionNode): string {
    return this.htmlNode('ins', node)
  }
  
  writeRevisionDeletion(node: RevisionDeletionNode): string {
    return this.htmlNode('del', node)
  }
  
  writeSpoiler(node: SpoilerNode): string {
    return this.htmlNode('span', node, { class: 'spoiler' })
  }
  
  writeInlineAside(node: InlineAsideNode): string {
    return this.htmlNode('small', node)
  }
  
  writeLink(node: LinkNode): string {
    return this.htmlNode('a', node, { href: node.url })
  }
  
  htmlNode(tagName: string, node: RichSyntaxNode, attrs: any = {}): string {
    return htmlNode(tagName, this.htmlNodes(node.children), attrs)
  }
  
  htmlNodes(nodes: SyntaxNode[]): string {
    return nodes.reduce(
      (html, child) => html + this.write(child),
      '')
  }
}

function htmlNode(tagName: string, content: string, attrs: any = {}): string {
  const unrolledAttrs =
    Object.keys(attrs)
      .map((key) => `${key}="${attrs[key]}"`)
      .join(' ')
  
  return `<${tagName + unrolledAttrs}>${content}</${tagName}>`
}