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
import { SpoilerNode } from '../SyntaxNodes/SpoilerNode'
import { FootnoteNode } from '../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../SyntaxNodes/FootnoteBlockNode'
import { ParagraphNode } from '../SyntaxNodes/ParagraphNode'
import { BlockquoteNode } from '../SyntaxNodes/BlockquoteNode'
import { UnorderedListNode } from '../SyntaxNodes/UnorderedListNode'
import { UnorderedListItem } from '../SyntaxNodes/UnorderedListItem'
import { OrderedListNode } from '../SyntaxNodes/OrderedListNode'
import { OrderedListOrder } from '../SyntaxNodes/OrderedListOrder'
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
import { UpConfig } from '../UpConfig'


export class HtmlWriter extends Writer {
  // If a link is nested within another link, we include the inner link's contents directly in the outer link.
  // We don't create an anchor element for the inner link.
  private isInsideLink = false

  constructor(config?: UpConfig) {
    super(config)
  }

  protected document(node: DocumentNode): string {
    return this.htmlElements(node.children)
  }

  protected blockquote(node: BlockquoteNode): string {
    return this.htmlElement('blockquote', node.children)
  }

  protected unorderedList(node: UnorderedListNode): string {
    return htmlElement(
      'ul',
      node.listItems.map((listItem) => this.unorderedListItem(listItem)).join('')
    )
  }

  protected orderedList(node: OrderedListNode): string {
    const attrs: { start?: number, reversed?: any } = {}

    const start = node.start()
    if (start != null) {
      attrs.start = start
    }

    if (node.order() === OrderedListOrder.Descrending) {
      attrs.reversed = null
    }

    return htmlElement(
      'ol',
      node.listItems.map((listItem) => this.orderedListItem(listItem)).join(''),
      attrs
    )
  }

  protected descriptionList(node: DescriptionListNode): string {
    return htmlElement(
      'dl',
      node.listItems.map((listItem) => this.descriptionListItem(listItem)).join('')
    )
  }

  protected lineBlock(node: LineBlockNode): string {
    return htmlElement(
      'div',
      node.lines.map((line) => this.line(line)).join(''),
      { [dataAttr('lines')]: null }
    )
  }

  protected codeBlock(node: CodeBlockNode): string {
    return htmlElement('pre', htmlElement('code', node.text))
  }

  protected paragraph(node: ParagraphNode): string {
    return this.htmlElement('p', node.children)
  }

  protected heading(node: HeadingNode): string {
    return this.htmlElement('h' + Math.min(6, node.level), node.children)
  }

  protected sectionSeparator(node: SectionSeparatorNode): string {
    return htmlElementWithNoEndTag('hr')
  }

  protected emphasis(node: EmphasisNode): string {
    return this.htmlElement('em', node.children)
  }

  protected stress(node: StressNode): string {
    return this.htmlElement('strong', node.children)
  }

  protected inlineCode(node: InlineCodeNode): string {
    return htmlElement('code', node.text)
  }

  protected revisionInsertion(node: RevisionInsertionNode): string {
    return this.htmlElement('ins', node.children)
  }

  protected revisionDeletion(node: RevisionDeletionNode): string {
    return this.htmlElement('del', node.children)
  }

  protected parenthesized(node: ParenthesizedNode): string {
    return this.bracketed(node, 'parenthesized')
  }

  protected squareBracketed(node: SquareBracketedNode): string {
    return this.bracketed(node, 'square-bracketed')
  }

  protected action(node: ActionNode): string {
    return this.htmlElement('span', node.children, { [dataAttr('action')]: null })
  }

  protected spoiler(node: SpoilerNode): string {
    return this.htmlElement('span', node.children, { [dataAttr('spoiler')]: null })
  }

  protected footnoteReference(node: FootnoteNode): string {
    const innerLinkNode = this.footnoteReferenceInnerLink(node)

    return this.htmlElement(
      'sup',
      [innerLinkNode], {
        id: this.footnoteReferenceId(node.referenceNumber),
        [dataAttr('footnote-reference')]: null
      })
  }

  protected footnoteBlock(node: FootnoteBlockNode): string {
    return htmlElement(
      'dl',
      node.footnotes.map(footnote => this.footnote(footnote)).join(''),
      { [dataAttr('footnotes')]: null })
  }

  protected link(node: LinkNode): string {
    if (this.isInsideLink) {
      return node.children.map(child => this.write(child)).join('')
    }

    this.isInsideLink = true
    const html = this.htmlElement('a', node.children, { href: node.url })
    this.isInsideLink = false

    return html
  }

  protected image(node: ImageNode): string {
    return htmlElementWithNoEndTag('img', { src: node.url, alt: node.description, title: node.description })
  }

  protected audio(node: AudioNode): string {
    const { description, url } = node

    return this.htmlElement('audio', this.mediaFallback(description, url), { src: url, title: description })
  }

  protected video(node: VideoNode): string {
    const { description, url } = node

    return this.htmlElement('video', this.mediaFallback(description, url), { src: url, title: description })
  }

  protected plainText(node: PlainTextNode): string {
    return node.text
  }

  private bracketed(bracketed: ParenthesizedNode | SquareBracketedNode, dataAttributeName: string): string {
    return this.htmlElement('span', bracketed.children, { [dataAttr(dataAttributeName)]: null })
  }

  private unorderedListItem(listItem: UnorderedListItem): string {
    return this.htmlElement('li', listItem.children)
  }

  private orderedListItem(listItem: OrderedListItem): string {
    const attrs: { value?: number } = {}

    if (listItem.ordinal != null) {
      attrs.value = listItem.ordinal
    }

    return this.htmlElement('li', listItem.children, attrs)
  }

  private descriptionListItem(listItem: DescriptionListItem): string {
    return (
      listItem.terms.map((term) => this.descriptionTerm(term)).join('')
      + this.description(listItem.description)
    )
  }

  private descriptionTerm(term: DescriptionTerm): string {
    return this.htmlElement('dt', term.children)
  }

  private description(description: Description): string {
    return this.htmlElement('dd', description.children)
  }

  private line(line: Line): string {
    return this.htmlElement('div', line.children)
  }

  private footnoteReferenceInnerLink(footnoteReference: FootnoteNode): LinkNode {
    const referenceNumber = footnoteReference.referenceNumber

    return new LinkNode(
      [new PlainTextNode(referenceNumber.toString())],
      internalUrl(this.footnoteId(referenceNumber)))
  }

  private footnote(footnote: FootnoteNode): string {
    const termHtml =
      this.htmlElement(
        'dt',
        [this.footnoteLinkBackToReference(footnote)],
        { id: this.footnoteId(footnote.referenceNumber) })

    const descriptionHtml =
      this.htmlElement('dd', footnote.children)

    return termHtml + descriptionHtml
  }

  private footnoteLinkBackToReference(footnote: FootnoteNode): LinkNode {
    const referenceNumber = footnote.referenceNumber

    return new LinkNode(
      [new PlainTextNode(referenceNumber.toString())],
      internalUrl(this.footnoteReferenceId(referenceNumber))
    )
  }

  private mediaFallback(content: string, url: string): LinkNode[] {
    return [new LinkNode([new PlainTextNode(content)], url)]
  }

  private htmlElement(tagName: string, children: SyntaxNode[], attrs: any = {}): string {
    return htmlElement(tagName, this.htmlElements(children), attrs)
  }

  private htmlElements(nodes: SyntaxNode[]): string {
    return nodes.reduce(
      (html, child) => html + this.write(child),
      '')
  }

  private footnoteId(referenceNumber: number): string {
    return this.getId(this.config.settings.i18n.terms.footnote, referenceNumber)
  }

  private footnoteReferenceId(referenceNumber: number): string {
    return this.getId(this.config.settings.i18n.terms.footnoteReference, referenceNumber)
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

function internalUrl(id: string): string {
  return '#' + id
}

function dataAttr(name: string): string {
  return 'data-up-' + name
}
