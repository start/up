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
import { FootnoteReferenceNode } from '../SyntaxNodes/FootnoteReferenceNode'
import { FootnoteBlockNode } from '../SyntaxNodes/FootnoteBlockNode'
import { ParagraphNode } from '../SyntaxNodes/ParagraphNode'
import { BlockquoteNode } from '../SyntaxNodes/BlockquoteNode'
import { UnorderedListNode } from '../SyntaxNodes/UnorderedListNode'
import { UnorderedListItem } from '../SyntaxNodes/UnorderedListItem'
import { OrderedListNode, ListOrder } from '../SyntaxNodes/OrderedListNode'
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
import { Writer } from './Writer'
import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { WriterConfig, WriterConfigArgs } from './WriterConfig'

export class HtmlWriter extends Writer {
  constructor(config?: WriterConfigArgs) {
    super(config)
  }
  
  document(node: DocumentNode): string {
    return this.htmlElements(node.children)
  }

  blockquote(node: BlockquoteNode): string {
    return this.htmlElement('blockquote', node.children)
  }

  unorderedList(node: UnorderedListNode): string {
    return htmlElement(
      'ul',
      node.listItems.map((listItem) => this.unorderedListItem(listItem)).join('')
    )
  }

  unorderedListItem(listItem: UnorderedListItem): string {
    return this.htmlElement('li', listItem.children)
  }

  orderedList(node: OrderedListNode): string {
    const attrs: { start?: number, reversed?: any } = {}

    const start = node.start()
    if (start != null) {
      attrs.start = start
    }

    if (node.order() === ListOrder.Descrending) {
      attrs.reversed = null
    }

    return htmlElement(
      'ol',
      node.listItems.map((listItem) => this.orderedListItem(listItem)).join(''),
      attrs
    )
  }

  orderedListItem(listItem: OrderedListItem): string {
    const attrs: { value?: number } = {}

    if (listItem.ordinal != null) {
      attrs.value = listItem.ordinal
    }

    return this.htmlElement('li', listItem.children, attrs)
  }

  descriptionList(node: DescriptionListNode): string {
    return htmlElement(
      'dl',
      node.listItems.map((listItem) => this.descriptionListItem(listItem)).join('')
    )
  }

  descriptionListItem(listItem: DescriptionListItem): string {
    return (
      listItem.terms.map((term) => this.descriptionTerm(term)).join('')
      + this.description(listItem.description)
    )
  }

  descriptionTerm(term: DescriptionTerm): string {
    return this.htmlElement('dt', term.children)
  }

  description(description: Description): string {
    return this.htmlElement('dd', description.children)
  }

  lineBlock(node: LineBlockNode): string {
    return htmlElement(
      'div',
      node.lines.map((line) => this.line(line)).join(''),
      { 'data-lines': null }
    )
  }

  line(line: Line): string {
    return this.htmlElement('div', line.children)
  }

  codeBlock(node: CodeBlockNode): string {
    return htmlElement('pre', htmlElement('code', node.text))
  }

  paragraph(node: ParagraphNode): string {
    return this.htmlElement('p', node.children)
  }

  heading(node: HeadingNode): string {
    return this.htmlElement('h' + Math.min(6, node.level), node.children)
  }

  sectionSeparator(node: SectionSeparatorNode): string {
    return htmlElementWithNoEndTag('hr')
  }

  emphasis(node: EmphasisNode): string {
    return this.htmlElement('em', node.children)
  }

  stress(node: StressNode): string {
    return this.htmlElement('strong', node.children)
  }

  inlineCode(node: InlineCodeNode): string {
    return htmlElement('code', node.text)
  }

  revisionInsertion(node: RevisionInsertionNode): string {
    return this.htmlElement('ins', node.children)
  }

  revisionDeletion(node: RevisionDeletionNode): string {
    return this.htmlElement('del', node.children)
  }

  spoiler(node: SpoilerNode): string {
    return this.htmlElement('span', node.children, { 'data-spoiler': null })
  }

  footnoteReference(node: FootnoteReferenceNode): string {
    const ordinal = node.referenceOrdinal
    
    const innerLinkNode =
      new LinkNode(
        [new PlainTextNode(ordinal.toString())],
        this.config.getFootnoteId(ordinal))
        
    return this.htmlElement('sup', [innerLinkNode], { id: 'todo' })
  }

  footnoteBlock(node: FootnoteBlockNode): string {
    throw new Error("Not implemented!")
  }

  link(node: LinkNode): string {
    return this.htmlElement('a', node.children, { href: node.url })
  }

  image(node: ImageNode): string {
    return htmlElementWithNoEndTag('img', { src: node.url, alt: node.description, title: node.description })
  }

  audio(node: AudioNode): string {
    const { description, url } = node
    
    return this.htmlElement('audio', this.mediaFallback(description, url), { src: url, title: description })
  }

  video(node: VideoNode): string {
    const { description, url } = node

    return this.htmlElement('video', this.mediaFallback(description, url), { src: url, title: description })
  }

  plainText(node: PlainTextNode): string {
    return node.text
  }

  htmlElement(tagName: string, children: SyntaxNode[], attrs: any = {}): string {
    return htmlElement(tagName, this.htmlElements(children), attrs)
  }

  htmlElements(nodes: SyntaxNode[]): string {
    return nodes.reduce(
      (html, child) => html + this.write(child),
      '')
  }
  
  private mediaFallback(content: string, url: string): LinkNode[] {
    return [new LinkNode([new PlainTextNode(content)], url)]
  }
}

function htmlElement(tagName: string, content: string, attrs: any = {}): string {
  return `${htmlTag(tagName, attrs)}${content}</${tagName}>`
}

function htmlElementWithNoEndTag(tagName: string, attrs: any = {}): string {
  return htmlTag(tagName, attrs)
}

function htmlTag(tagName: string, attrs: any): string {
  const tagNameWithAttrs =
    [tagName].concat(htmlAttrs(attrs)).join(' ')

  return `<${tagNameWithAttrs}>`
}

function htmlAttrs(attrs: any): string[] {
  return (
    Object.keys(attrs)
      .map(key => {
        const value = attrs[key]
        return (value == null ? key : `${key}="${value}"`)
      })
  )
}
