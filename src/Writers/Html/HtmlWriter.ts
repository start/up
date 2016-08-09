import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { ImageNode } from '../../SyntaxNodes/ImageNode'
import { AudioNode } from '../../SyntaxNodes/AudioNode'
import { VideoNode } from '../../SyntaxNodes/VideoNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
import { EmphasisNode } from '../../SyntaxNodes/EmphasisNode'
import { StressNode } from '../../SyntaxNodes/StressNode'
import { InlineCodeNode } from '../../SyntaxNodes/InlineCodeNode'
import { RevisionInsertionNode } from '../../SyntaxNodes/RevisionInsertionNode'
import { RevisionDeletionNode } from '../../SyntaxNodes/RevisionDeletionNode'
import { ParenthesizedNode } from '../../SyntaxNodes/ParenthesizedNode'
import { SquareBracketedNode } from '../../SyntaxNodes/SquareBracketedNode'
import { ActionNode } from '../../SyntaxNodes/ActionNode'
import { InlineSpoilerNode } from '../../SyntaxNodes/InlineSpoilerNode'
import { InlineNsfwNode } from '../../SyntaxNodes/InlineNsfwNode'
import { InlineNsflNode } from '../../SyntaxNodes/InlineNsflNode'
import { SpoilerBlockNode } from '../../SyntaxNodes/SpoilerBlockNode'
import { NsfwBlockNode } from '../../SyntaxNodes/NsfwBlockNode'
import { NsflBlockNode } from '../../SyntaxNodes/NsflBlockNode'
import { FootnoteNode } from '../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../SyntaxNodes/FootnoteBlockNode'
import { TableNode } from '../../SyntaxNodes/TableNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'
import { UnorderedListNode } from '../../SyntaxNodes/UnorderedListNode'
import { OrderedListNode } from '../../SyntaxNodes/OrderedListNode'
import { DescriptionListNode } from '../../SyntaxNodes/DescriptionListNode'
import { LineBlockNode } from '../../SyntaxNodes/LineBlockNode'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { CodeBlockNode } from '../../SyntaxNodes/CodeBlockNode'
import { Writer } from '.././Writer'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'
import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { htmlElement, htmlElementWithAlreadyEscapedChildren, singleTagHtmlElement, classAttrValue, internalFragmentUrl, NO_ATTRIBUTE_VALUE } from './WritingHelpers'
import { escapeHtmlContent } from './EscapingHelpers'


export class HtmlWriter extends Writer {
  // Our HTML for revealable content (spoilers, NSFW, NSFL) doesn't require JavaScript (just CSS), and it works
  // perfectly well for screen-readers
  //
  // For example, here's our HTML for inline spoilers:
  //
  // <span class="up-spoiler up-revealable">
  //   <label for="up-spoiler-1">toggle spoiler</label>
  //   <input id="up-spoiler-1" type="checkbox">
  //   <span>Ash fights Gary</span>
  // </span>
  //
  // Unfortunately, this solution requires generating unique IDs to associate each spoiler's label with its
  // checkbox.
  //
  // Because each Writer class instance is only used once per document, we can simply increment a counter each
  // time we write a spoiler (inline or block), appending the counter's value to the checkbox's ID.
  //
  // We'll do the same for NSFW and NSFL conventions.
  private spoilerCount = 0
  private nsfwCount = 0
  private nsflCount = 0

  // If a link is nested within another link, we include the inner link's contents directly in the outer link.
  // We don't create an anchor element for the inner link.
  private isInsideLink = false

  // One last hack!  Within the table of contents itself, no HTML is produced for footnotes. They're ignored.   
  private isInsideTableOfContents = false

  protected document(node: DocumentNode): string {
    const tableOfContents =
      node.tableOfContents
        ? this.tableOfContents(node.tableOfContents)
        : ''

    return tableOfContents + this.writeAll(node.children)
  }

  protected blockquote(node: BlockquoteNode): string {
    return this.htmlElementWithAlreadyEscapedChildren('blockquote', node.children)
  }

  protected unorderedList(node: UnorderedListNode): string {
    return htmlElementWithAlreadyEscapedChildren(
      'ul',
      node.items.map(listItem => this.unorderedListItem(listItem)))
  }

  protected orderedList(node: OrderedListNode): string {
    const attrs: { start?: number, reversed?: any } = {}

    const start = node.start()

    if (start != null) {
      attrs.start = start
    }

    if (node.order() === OrderedListNode.Order.Descrending) {
      attrs.reversed = NO_ATTRIBUTE_VALUE
    }

    return htmlElementWithAlreadyEscapedChildren(
      'ol',
      node.items.map(listItem => this.orderedListItem(listItem)),
      attrs)
  }

  protected descriptionList(node: DescriptionListNode): string {
    return htmlElementWithAlreadyEscapedChildren(
      'dl',
      node.items.map(item => this.descriptionListItem(item)))
  }

  protected lineBlock(node: LineBlockNode): string {
    return htmlElementWithAlreadyEscapedChildren(
      'div',
      node.lines.map(line => this.line(line)),
      { class: classAttrValue('lines') })
  }

  protected codeBlock(node: CodeBlockNode): string {
    return htmlElementWithAlreadyEscapedChildren(
      'pre',
      [htmlElement('code', node.code)])
  }

  protected paragraph(node: ParagraphNode): string {
    return this.htmlElementWithAlreadyEscapedChildren('p', node.children)
  }

  protected heading(node: HeadingNode): string {
    return this.htmlElementWithAlreadyEscapedChildren(
      'h' + Math.min(6, node.level),
      node.children,
      this.getAttrsForElementPossiblyReferencedByTableOfContents(node))
  }

  protected outlineSeparator(): string {
    return singleTagHtmlElement('hr')
  }

  protected emphasis(node: EmphasisNode): string {
    return this.htmlElementWithAlreadyEscapedChildren('em', node.children)
  }

  protected stress(node: StressNode): string {
    return this.htmlElementWithAlreadyEscapedChildren('strong', node.children)
  }

  protected inlineCode(node: InlineCodeNode): string {
    return htmlElement('code', node.code)
  }

  protected revisionInsertion(node: RevisionInsertionNode): string {
    return this.htmlElementWithAlreadyEscapedChildren('ins', node.children)
  }

  protected revisionDeletion(node: RevisionDeletionNode): string {
    return this.htmlElementWithAlreadyEscapedChildren('del', node.children)
  }

  protected parenthesized(node: ParenthesizedNode): string {
    return this.bracketed(node, 'parenthesized')
  }

  protected squareBracketed(node: SquareBracketedNode): string {
    return this.bracketed(node, 'square-bracketed')
  }

  protected action(node: ActionNode): string {
    return this.htmlElementWithAlreadyEscapedChildren('span', node.children, { class: classAttrValue('action') })
  }

  protected inlineSpoiler(node: InlineSpoilerNode): string {
    return this.spoiler(node, 'span')
  }

  protected inlineNsfw(node: InlineNsfwNode): string {
    return this.nsfw(node, 'span')
  }

  protected inlineNsfl(node: InlineNsflNode): string {
    return this.nsfl(node, 'span')
  }

  protected spoilerBlock(node: SpoilerBlockNode): string {
    return this.spoiler(node, 'div')
  }

  protected nsfwBlock(node: NsfwBlockNode): string {
    return this.nsfw(node, 'div')
  }

  protected nsflBlock(node: NsflBlockNode): string {
    return this.nsfl(node, 'div')
  }

  protected spoiler(node: InlineSpoilerNode | SpoilerBlockNode, genericContainerTagName: string): string {
    return this.revealableConvent({
      nonLocalizedConventionTerm: 'spoiler',
      termForTogglingVisibility: this.config.settings.i18n.terms.toggleSpoiler,
      conventionCount: ++this.spoilerCount,
      revealableChildren: node.children,
      genericContainerTagName
    })
  }

  protected nsfw(node: InlineNsfwNode | NsfwBlockNode, genericContainerTagName: string): string {
    return this.revealableConvent({
      nonLocalizedConventionTerm: 'nsfw',
      termForTogglingVisibility: this.config.settings.i18n.terms.toggleNsfw,
      conventionCount: ++this.nsfwCount,
      revealableChildren: node.children,
      genericContainerTagName
    })
  }

  protected nsfl(node: InlineNsflNode | NsflBlockNode, genericContainerTagName: string): string {
    return this.revealableConvent({
      nonLocalizedConventionTerm: 'nsfl',
      termForTogglingVisibility: this.config.settings.i18n.terms.toggleNsfl,
      conventionCount: ++this.nsflCount,
      revealableChildren: node.children,
      genericContainerTagName
    })
  }

  protected footnoteReference(node: FootnoteNode): string {
    if (this.isInsideTableOfContents) {
      // Within the table of contents itself, no HTML is produced for footnotes. They're ignored.   
      return ''
    }

    const innerLinkNode = this.footnoteReferenceInnerLink(node)

    return this.htmlElementWithAlreadyEscapedChildren(
      'sup',
      [innerLinkNode], {
        id: this.footnoteReferenceId(node.referenceNumber),
        class: classAttrValue('footnote-reference')
      })
  }

  protected footnoteBlock(node: FootnoteBlockNode): string {
    return htmlElementWithAlreadyEscapedChildren(
      'dl',
      node.footnotes.map(footnote => this.footnote(footnote)),
      { class: classAttrValue('footnotes') })
  }

  protected table(node: TableNode): string {
    return htmlElementWithAlreadyEscapedChildren(
      'table', [
        this.tableCaption(node.caption),
        this.tableHeader(node.header),
        node.rows.map(row => this.tableRow(row)).join('')
      ],
      this.getAttrsForElementPossiblyReferencedByTableOfContents(node))
  }

  protected link(node: LinkNode): string {
    if (this.isInsideLink) {
      return this.writeAll(node.children)
    }

    this.isInsideLink = true
    const html = this.htmlElementWithAlreadyEscapedChildren('a', node.children, { href: node.url })
    this.isInsideLink = false

    return html
  }

  protected image(node: ImageNode): string {
    return singleTagHtmlElement('img', { src: node.url, alt: node.description, title: node.description })
  }

  protected audio(node: AudioNode): string {
    return this.playableMediaElement('audio', node.description, node.url)
  }

  protected video(node: VideoNode): string {
    return this.playableMediaElement('video', node.description, node.url)
  }

  protected plainText(node: PlainTextNode): string {
    return escapeHtmlContent(node.content)
  }

  private bracketed(bracketed: ParenthesizedNode | SquareBracketedNode, bracketName: string): string {
    return this.htmlElementWithAlreadyEscapedChildren('span', bracketed.children, { class: classAttrValue(bracketName) })
  }

  private unorderedListItem(listItem: UnorderedListNode.Item): string {
    return this.htmlElementWithAlreadyEscapedChildren('li', listItem.children)
  }

  private tableOfContents(tableOfContents: DocumentNode.TableOfContents): string {
    this.isInsideTableOfContents = true

    const html =
      htmlElementWithAlreadyEscapedChildren(
        'nav', [
          this.tableOfContentsTitle(),
          this.tableOfContentsEntries(tableOfContents.entries)
        ],
        { class: classAttrValue("table-of-contents") })

    this.isInsideTableOfContents = false

    return html
  }

  private tableOfContentsTitle(): string {
    return this.write(
      new HeadingNode([
        new PlainTextNode(this.config.settings.i18n.terms.tableOfContents)], 1))
  }

  private tableOfContentsEntries(entries: OutlineSyntaxNode[]): string {
    const listItems =
      entries.map((entry, index) =>
        new UnorderedListNode.Item([
          this.nodeRepresentingTableOfContentsEntry(entry, index)
        ]))

    return this.write(new UnorderedListNode(listItems))
  }

  private nodeRepresentingTableOfContentsEntry(entry: OutlineSyntaxNode, indexOfEntry: number): OutlineSyntaxNode {
    const ordinal = indexOfEntry + 1

    if (entry instanceof HeadingNode) {
      return new HeadingNode(
        [this.linkToElementReferencedByTableOfContents(entry.children, ordinal)],
        entry.level + 1)
    }

    if (entry instanceof TableNode) {
      return this.linkToElementReferencedByTableOfContents(entry.caption.children, ordinal)
    }

    throw new Error('Unrecognized tables of contents entry')
  }

  private linkToElementReferencedByTableOfContents(children: InlineSyntaxNode[], ordinalTableOfContentsEntry: number): LinkNode {
    const idOfElement =
      this.idOfElementReferencedByTableOfContents(ordinalTableOfContentsEntry)

    return new LinkNode(children, internalFragmentUrl(idOfElement))
  }

  private orderedListItem(listItem: OrderedListNode.Item): string {
    const attrs: { value?: number } = {}

    if (listItem.ordinal != null) {
      attrs.value = listItem.ordinal
    }

    return this.htmlElementWithAlreadyEscapedChildren('li', listItem.children, attrs)
  }

  private descriptionListItem(listItem: DescriptionListNode.Item): string {
    return (
      listItem.terms.map(term => this.descriptionTerm(term)).join('')
      + this.description(listItem.description))
  }

  private descriptionTerm(term: DescriptionListNode.Item.Term): string {
    return this.htmlElementWithAlreadyEscapedChildren('dt', term.children)
  }

  private description(description: DescriptionListNode.Item.Description): string {
    return this.htmlElementWithAlreadyEscapedChildren('dd', description.children)
  }

  private line(line: LineBlockNode.Line): string {
    return this.htmlElementWithAlreadyEscapedChildren('div', line.children)
  }

  private footnoteReferenceInnerLink(footnoteReference: FootnoteNode): LinkNode {
    const referenceNumber = footnoteReference.referenceNumber

    return new LinkNode(
      [new PlainTextNode(referenceNumber.toString())],
      internalFragmentUrl(this.footnoteId(referenceNumber)))
  }

  private footnote(footnote: FootnoteNode): string {
    const termHtml =
      this.htmlElementWithAlreadyEscapedChildren(
        'dt',
        [this.footnoteLinkBackToReference(footnote)],
        { id: this.footnoteId(footnote.referenceNumber) })

    const descriptionHtml =
      this.htmlElementWithAlreadyEscapedChildren('dd', footnote.children)

    return termHtml + descriptionHtml
  }

  private footnoteLinkBackToReference(footnote: FootnoteNode): LinkNode {
    const referenceNumber = footnote.referenceNumber

    return new LinkNode(
      [new PlainTextNode(referenceNumber.toString())],
      internalFragmentUrl(this.footnoteReferenceId(referenceNumber)))
  }

  private playableMediaElement(tagName: string, description: string, url: string): string {
    return this.htmlElementWithAlreadyEscapedChildren(
      tagName,
      this.playableMediaFallback(description, url), {
        src: url,
        title: description,
        controls: NO_ATTRIBUTE_VALUE,
        loop: NO_ATTRIBUTE_VALUE
      })
  }

  private playableMediaFallback(content: string, url: string): LinkNode[] {
    return [new LinkNode([new PlainTextNode(content)], url)]
  }

  private revealableConvent(
    args: {
      nonLocalizedConventionTerm: string
      termForTogglingVisibility: string
      conventionCount: number
      revealableChildren: SyntaxNode[]
      genericContainerTagName: string
    }
  ): string {
    const { nonLocalizedConventionTerm, conventionCount, termForTogglingVisibility, revealableChildren, genericContainerTagName } = args

    const localizedTerm = this.config.localizeTerm(nonLocalizedConventionTerm)
    const checkboxId = this.getId(localizedTerm, conventionCount)

    const label =
      htmlElement('label', termForTogglingVisibility, { for: checkboxId })

    const checkbox =
      singleTagHtmlElement('input', { id: checkboxId, type: 'checkbox' })

    const content =
      this.htmlElementWithAlreadyEscapedChildren(genericContainerTagName, revealableChildren)

    return htmlElementWithAlreadyEscapedChildren(
      genericContainerTagName,
      [label, checkbox, content],
      { class: classAttrValue(nonLocalizedConventionTerm, 'revealable') })
  }

  private tableCaption(caption: TableNode.Caption): string {
    return (
      caption
        ? htmlElementWithAlreadyEscapedChildren(
          'caption', this.writeEach(caption.children))
        : '')
  }

  private tableHeader(header: TableNode.Header): string {
    const headerRow =
      htmlElementWithAlreadyEscapedChildren(
        'tr',
        header.cells.map(cell => this.tableHeaderCell(cell, 'col')))

    return htmlElementWithAlreadyEscapedChildren('thead', [headerRow])
  }

  private tableHeaderCell(
    cell: TableNode.Header.Cell,
    scope: 'col' | 'row'
  ): string {
    return this.tableCell('th', cell, { scope })
  }

  private tableRow(row: TableNode.Row): string {
    const cells =
      row.cells.map(cell => this.tableRowCell(cell))

    if (row.headerCell) {
      cells.unshift(this.tableHeaderCell(row.headerCell, 'row'))
    }

    return htmlElementWithAlreadyEscapedChildren('tr', cells)
  }

  private tableRowCell(cell: TableNode.Row.Cell): string {
    const attrs: { class?: string } = {}

    if (cell.isNumeric()) {
      attrs.class = classAttrValue('numeric')
    }

    return this.tableCell('td', cell, attrs)
  }

  private tableCell(tagName: string, cell: TableNode.Cell, attrs: any = {}): string {
    if (cell.countColumnsSpanned > 1) {
      attrs.colspan = cell.countColumnsSpanned
    }

    return htmlElementWithAlreadyEscapedChildren(
      tagName,
      this.writeEach(cell.children),
      attrs
    )
  }

  private htmlElementWithAlreadyEscapedChildren(tagName: string, children: SyntaxNode[], attrs: any = {}): string {
    return htmlElementWithAlreadyEscapedChildren(tagName, this.writeEach(children), attrs)
  }

  private getAttrsForElementPossiblyReferencedByTableOfContents(node: OutlineSyntaxNode): AttrsWithPossibleId {
    const attrs: AttrsWithPossibleId = {}

    const ordinalOfEntryInTableOfContents =
      this.getOrdinalOfEntryInTableOfContents(node)

    if (ordinalOfEntryInTableOfContents) {
      attrs.id = this.idOfElementReferencedByTableOfContents(ordinalOfEntryInTableOfContents)
    }

    return attrs
  }

  private idOfElementReferencedByTableOfContents(ordinal: number): string {
    return this.getId(this.config.settings.i18n.terms.itemReferencedByTableOfContents, ordinal)
  }

  // Returns the ordinal (1-based!) of an outline syntax node's entry in the table of contents.
  //
  // Returns null if there isn't an entry in the table of contents for the node.  
  private getOrdinalOfEntryInTableOfContents(node: OutlineSyntaxNode): number {
    if (!this.documentNode.tableOfContents) {
      return null
    }

    const index =
      this.documentNode.tableOfContents.entries.indexOf(node)

    return (index >= 0) ? (index + 1) : null
  }

  private footnoteId(referenceNumber: number): string {
    return this.getId(this.config.settings.i18n.terms.footnote, referenceNumber)
  }

  private footnoteReferenceId(referenceNumber: number): string {
    return this.getId(this.config.settings.i18n.terms.footnoteReference, referenceNumber)
  }
}


interface AttrsWithPossibleId {
  id?: string
}
