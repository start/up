
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
import { UnorderedListNode } from '../SyntaxNodes/UnorderedListNode'
import { UnorderedListItemNode } from '../SyntaxNodes/UnorderedListItemNode'
import { OrderedListNode } from '../SyntaxNodes/OrderedListNode'
import { OrderedListItemNode } from '../SyntaxNodes/OrderedListItemNode'
import { LineBlockNode } from '../SyntaxNodes/LineBlockNode'
import { LineNode } from '../SyntaxNodes/LineNode'
import { HeadingNode } from '../SyntaxNodes/HeadingNode'
import { CodeBlockNode } from '../SyntaxNodes/CodeBlockNode'
import { SectionSeparatorNode } from '../SyntaxNodes/SectionSeparatorNode'
import { Writer } from './Writer'

export class HtmlWriter extends Writer {
  document(node: DocumentNode): string {
    return this.htmlElements(node.children)
  }

  blockquote(node: BlockquoteNode): string {
    return this.htmlElement('blockquote', node)
  }

  unorderedList(node: UnorderedListNode): string {
    return this.htmlElement('ul', node)
  }

  unorderedListItem(node: UnorderedListItemNode): string {
    return this.htmlElement('li', node)
  }

  orderedList(node: OrderedListNode): string {
    return this.htmlElement('ol', node)
  }

  orderedListItem(node: OrderedListItemNode): string {
    return this.htmlElement('li', node)
  }

  lineBlock(node: LineBlockNode): string {
    return this.htmlElements(node.children)
  }

  line(node: LineNode): string {
    return this.htmlElement('div', node)
  }

  codeBlock(node: CodeBlockNode): string {
    return htmlElement('pre', htmlElement('code', node.text))
  }

  paragraph(node: ParagraphNode): string {
    return this.htmlElement('p', node)
  }

  heading(node: HeadingNode): string {
    return this.htmlElement('h' + Math.min(6, node.level), node)
  }

  emphasis(node: EmphasisNode): string {
    return this.htmlElement('em', node)
  }

  stress(node: StressNode): string {
    return this.htmlElement('strong', node)
  }

  inlineCode(node: InlineCodeNode): string {
    return htmlElement('code', node.text)
  }

  revisionInsertion(node: RevisionInsertionNode): string {
    return this.htmlElement('ins', node)
  }

  revisionDeletion(node: RevisionDeletionNode): string {
    return this.htmlElement('del', node)
  }

  spoiler(node: SpoilerNode): string {
    return this.htmlElement('span', node, { class: 'spoiler' })
  }

  inlineAside(node: InlineAsideNode): string {
    return this.htmlElement('small', node)
  }

  link(node: LinkNode): string {
    return this.htmlElement('a', node, { href: node.url })
  }

  plainText(node: PlainTextNode): string {
    return node.text
  }

  htmlElement(tagName: string, node: RichSyntaxNode, attrs: any = {}): string {
    return htmlElement(tagName, this.htmlElements(node.children), attrs)
  }

  htmlElements(nodes: SyntaxNode[]): string {
    return nodes.reduce(
      (html, child) => html + this.write(child),
      '')
  }
}

function htmlElement(tagName: string, content: string, attrs: any = {}): string {
  const htmlAttrs =
    Object.keys(attrs).map((key) => `${key}="${attrs[key]}"`)

  const openingTagContents =
    [tagName].concat(htmlAttrs).join(' ')

  return `<${openingTagContents}>${content}</${tagName}>`
}