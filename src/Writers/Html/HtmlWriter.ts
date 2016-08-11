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
import { OutlineSeparatorNode } from '../../SyntaxNodes/OutlineSeparatorNode'
import { Writer } from '.././Writer'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'
import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { htmlElement, htmlElementWithAlreadyEscapedChildren, singleTagHtmlElement, classAttrValue, internalFragmentUrl, NO_ATTRIBUTE_VALUE } from './WritingHelpers'
import { escapeHtmlContent } from './EscapingHelpers'


export class HtmlWriter extends Writer {
  // Our HTML for revealable content (spoilers, NSFW, and NSFL) doesn't require JavaScript (just CSS), and it
  // works perfectly well for screen-readers.
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
  // We don't create an <a> element for the inner link.
  private isInsideLink = false

  // One last hack!  Within the table of contents itself, no HTML is produced for footnotes. They're ignored.   
  private isInsideTableOfContents = false

  protected writeDocument(document: DocumentNode): string {
    const tableOfContents =
      document.tableOfContents
        ? this.tableOfContents(document.tableOfContents)
        : ''

    return tableOfContents + this.writeAll(document.children)
  }

  protected blockquote(blockquote: BlockquoteNode): string {
    return this.element('blockquote', blockquote.children, attrsFor(blockquote))
  }

  protected unorderedList(list: UnorderedListNode): string {
    return htmlElementWithAlreadyEscapedChildren(
      'ul',
      list.items.map(listItem => this.unorderedListItem(listItem)),
      attrsFor(list))
  }

  protected orderedList(list: OrderedListNode): string {
    const attrs: { start?: number, reversed?: any } = {}

    const start = list.start()

    if (start != null) {
      attrs.start = start
    }

    if (list.order() === OrderedListNode.Order.Descrending) {
      attrs.reversed = NO_ATTRIBUTE_VALUE
    }

    return htmlElementWithAlreadyEscapedChildren(
      'ol',
      list.items.map(listItem => this.orderedListItem(listItem)),
      attrsFor(list, attrs))
  }

  protected descriptionList(list: DescriptionListNode): string {
    return htmlElementWithAlreadyEscapedChildren(
      'dl',
      list.items.map(item => this.descriptionListItem(item)),
      attrsFor(list))
  }

  protected lineBlock(lineBlock: LineBlockNode): string {
    const attrs =
      attrsFor(
        lineBlock,
        { class: classAttrValue('lines') })

    return htmlElementWithAlreadyEscapedChildren(
      'div',
      lineBlock.lines.map(line => this.line(line)),
      attrs)
  }

  protected codeBlock(codeBlock: CodeBlockNode): string {
    return htmlElementWithAlreadyEscapedChildren(
      'pre',
      [htmlElement('code', codeBlock.code)],
      attrsFor(codeBlock))
  }

  protected paragraph(paragraph: ParagraphNode): string {
    return this.element('p', paragraph.children, attrsFor(paragraph))
  }

  protected heading(heading: HeadingNode): string {
    return this.element(
      'h' + Math.min(6, heading.level),
      heading.children,
      this.getAttrsForElementPossiblyReferencedByTableOfContents(heading))
  }

  protected outlineSeparator(separator: OutlineSeparatorNode): string {
    return singleTagHtmlElement('hr', attrsFor(separator))
  }

  protected emphasis(emphasis: EmphasisNode): string {
    return this.element('em', emphasis.children)
  }

  protected stress(stress: StressNode): string {
    return this.element('strong', stress.children)
  }

  protected inlineCode(inlineCode: InlineCodeNode): string {
    return htmlElement('code', inlineCode.code)
  }

  protected revisionInsertion(revisionInsertion: RevisionInsertionNode): string {
    return this.element('ins', revisionInsertion.children)
  }

  protected revisionDeletion(revisionDeletion: RevisionDeletionNode): string {
    return this.element('del', revisionDeletion.children)
  }

  protected parenthesized(parenthesized: ParenthesizedNode): string {
    return this.bracketed(parenthesized, 'parenthesized')
  }

  protected squareBracketed(squareBracketed: SquareBracketedNode): string {
    return this.bracketed(squareBracketed, 'square-bracketed')
  }

  protected action(action: ActionNode): string {
    return this.element('span', action.children, { class: classAttrValue('action') })
  }

  protected inlineSpoiler(inlineSpoiler: InlineSpoilerNode): string {
    return this.revealable({
      nonLocalizedConventionTerm: 'spoiler',
      termForTogglingVisibility: this.config.settings.i18n.terms.toggleSpoiler,
      conventionCount: ++this.spoilerCount,
      revealableChildren: inlineSpoiler.children,
      tagNameForGenericContainers: 'span'
    })
  }

  protected inlineNsfw(inlineNsfw: InlineNsfwNode): string {
    return this.revealable({
      nonLocalizedConventionTerm: 'nsfw',
      termForTogglingVisibility: this.config.settings.i18n.terms.toggleNsfw,
      conventionCount: ++this.nsfwCount,
      revealableChildren: inlineNsfw.children,
      tagNameForGenericContainers: 'span'
    })
  }

  protected inlineNsfl(inlineNsfl: InlineNsflNode): string {
    return this.revealable({
      nonLocalizedConventionTerm: 'nsfl',
      termForTogglingVisibility: this.config.settings.i18n.terms.toggleNsfl,
      conventionCount: ++this.nsflCount,
      revealableChildren: inlineNsfl.children,
      tagNameForGenericContainers: 'span'
    })
  }

  protected spoilerBlock(spoilerBlock: SpoilerBlockNode): string {
    return this.revealable({
      nonLocalizedConventionTerm: 'spoiler',
      termForTogglingVisibility: this.config.settings.i18n.terms.toggleSpoiler,
      conventionCount: ++this.spoilerCount,
      revealableChildren: spoilerBlock.children,
      tagNameForGenericContainers: 'div',
      attrsForOuterContainer: attrsFor(spoilerBlock)
    })
  }

  protected nsfwBlock(nsfwBlock: NsfwBlockNode): string {
    return this.revealable({
      nonLocalizedConventionTerm: 'nsfw',
      termForTogglingVisibility: this.config.settings.i18n.terms.toggleNsfw,
      conventionCount: ++this.nsfwCount,
      revealableChildren: nsfwBlock.children,
      tagNameForGenericContainers: 'div',
      attrsForOuterContainer: attrsFor(nsfwBlock)
    })
  }

  protected nsflBlock(nsflBlock: NsflBlockNode): string {
    return this.revealable({
      nonLocalizedConventionTerm: 'nsfl',
      termForTogglingVisibility: this.config.settings.i18n.terms.toggleNsfl,
      conventionCount: ++this.nsflCount,
      revealableChildren: nsflBlock.children,
      tagNameForGenericContainers: 'div',
      attrsForOuterContainer: attrsFor(nsflBlock)
    })
  }

  protected footnoteReference(footnote: FootnoteNode): string {
    if (this.isInsideTableOfContents) {
      // Within the table of contents itself, no HTML is produced for footnotes. They're ignored.   
      return ''
    }

    const innerLinkNode = this.footnoteReferenceInnerLink(footnote)

    return this.element(
      'sup',
      [innerLinkNode], {
        id: this.footnoteReferenceId(footnote.referenceNumber),
        class: classAttrValue('footnote-reference')
      })
  }

  protected footnoteBlock(footnoteBlock: FootnoteBlockNode): string {
    const attrs =
      attrsFor(
        footnoteBlock,
        { class: classAttrValue('footnotes') })

    return htmlElementWithAlreadyEscapedChildren(
      'dl',
      footnoteBlock.footnotes.map(footnote => this.footnote(footnote)),
      attrs)
  }

  protected table(table: TableNode): string {
    return htmlElementWithAlreadyEscapedChildren(
      'table', [
        this.tableCaption(table.caption),
        this.tableHeader(table.header),
        table.rows.map(row => this.tableRow(row)).join('')
      ],
      this.getAttrsForElementPossiblyReferencedByTableOfContents(table))
  }

  protected link(link: LinkNode): string {
    if (this.isInsideLink) {
      return this.writeAll(link.children)
    }

    this.isInsideLink = true

    const html =
      this.element('a',
        link.children,
        attrsFor(link, { href: link.url }))

    this.isInsideLink = false

    return html
  }

  protected image(image: ImageNode): string {
    const attrs =
      attrsFor(
        image, {
          src: image.url,
          alt: image.description,
          title: image.description
        })

    return singleTagHtmlElement('img', attrs)
  }

  protected audio(audio: AudioNode): string {
    return this.playableMediaElement(audio, 'audio')
  }

  protected video(video: VideoNode): string {
    return this.playableMediaElement(video, 'video')
  }

  protected plainText(plainText: PlainTextNode): string {
    return escapeHtmlContent(plainText.content)
  }

  private bracketed(bracketed: ParenthesizedNode | SquareBracketedNode, bracketName: string): string {
    return this.element('span', bracketed.children, { class: classAttrValue(bracketName) })
  }

  private unorderedListItem(listItem: UnorderedListNode.Item): string {
    return this.element('li', listItem.children)
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

    return this.element('li', listItem.children, attrs)
  }

  private descriptionListItem(listItem: DescriptionListNode.Item): string {
    return (
      listItem.terms.map(term => this.descriptionTerm(term)).join('')
      + this.description(listItem.description))
  }

  private descriptionTerm(term: DescriptionListNode.Item.Term): string {
    return this.element('dt', term.children)
  }

  private description(description: DescriptionListNode.Item.Description): string {
    return this.element('dd', description.children)
  }

  private line(line: LineBlockNode.Line): string {
    return this.element('div', line.children)
  }

  private footnoteReferenceInnerLink(footnoteReference: FootnoteNode): LinkNode {
    const referenceNumber = footnoteReference.referenceNumber

    return new LinkNode(
      [new PlainTextNode(referenceNumber.toString())],
      internalFragmentUrl(this.footnoteId(referenceNumber)))
  }

  private footnote(footnote: FootnoteNode): string {
    const termHtml =
      this.element(
        'dt',
        [this.footnoteLinkBackToReference(footnote)],
        { id: this.footnoteId(footnote.referenceNumber) })

    const descriptionHtml =
      this.element('dd', footnote.children)

    return termHtml + descriptionHtml
  }

  private footnoteLinkBackToReference(footnote: FootnoteNode): LinkNode {
    const referenceNumber = footnote.referenceNumber

    return new LinkNode(
      [new PlainTextNode(referenceNumber.toString())],
      internalFragmentUrl(this.footnoteReferenceId(referenceNumber)))
  }

  private playableMediaElement(media: AudioNode | VideoNode, tagName: string): string {
    const { url, description } = media

    const attrs =
      attrsFor(
        media, {
          src: url,
          title: description,
          controls: NO_ATTRIBUTE_VALUE,
          loop: NO_ATTRIBUTE_VALUE
        })

    return this.element(tagName, this.playableMediaFallback(description, url), attrs)
  }

  private playableMediaFallback(content: string, url: string): LinkNode[] {
    return [new LinkNode([new PlainTextNode(content)], url)]
  }

  private revealable(
    args: {
      nonLocalizedConventionTerm: string
      termForTogglingVisibility: string
      conventionCount: number
      revealableChildren: SyntaxNode[]
      tagNameForGenericContainers: string
      attrsForOuterContainer?: any
    }
  ): string {
    const { nonLocalizedConventionTerm, termForTogglingVisibility, tagNameForGenericContainers } = args

    const localizedTerm = this.config.localizeTerm(nonLocalizedConventionTerm)
    const checkboxId = this.getId(localizedTerm, args.conventionCount)

    const label =
      htmlElement('label', termForTogglingVisibility, { for: checkboxId })

    const checkbox =
      singleTagHtmlElement('input', { id: checkboxId, type: 'checkbox' })

    const content =
      this.element(tagNameForGenericContainers, args.revealableChildren)

    const attrsForOuterContainer = args.attrsForOuterContainer || {}

    attrsForOuterContainer.class =
      classAttrValue(nonLocalizedConventionTerm, 'revealable')

    return htmlElementWithAlreadyEscapedChildren(
      tagNameForGenericContainers,
      [label, checkbox, content],
      attrsForOuterContainer)
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

  private element(tagName: string, children: SyntaxNode[], attrs: any = {}): string {
    return htmlElementWithAlreadyEscapedChildren(tagName, this.writeEach(children), attrs)
  }

  private getAttrsForElementPossiblyReferencedByTableOfContents(node: OutlineSyntaxNode): AttrsWithPossibleId {
    const attrs: AttrsWithPossibleId = {}

    const ordinalOfEntryInTableOfContents =
      this.getOrdinalOfEntryInTableOfContents(node)

    if (ordinalOfEntryInTableOfContents) {
      attrs.id = this.idOfElementReferencedByTableOfContents(ordinalOfEntryInTableOfContents)
    }

    return attrsFor(node, attrs)
  }

  private idOfElementReferencedByTableOfContents(ordinal: number): string {
    return this.getId(this.config.settings.i18n.terms.itemReferencedByTableOfContents, ordinal)
  }

  // Returns the ordinal (1-based!) of an outline syntax node's entry in the table of contents.
  //
  // Returns null if there isn't an entry in the table of contents for the node.  
  private getOrdinalOfEntryInTableOfContents(node: OutlineSyntaxNode): number {
    if (!this.document.tableOfContents) {
      return null
    }

    const index =
      this.document.tableOfContents.entries.indexOf(node)

    return (index >= 0) ? (index + 1) : null
  }

  private footnoteId(referenceNumber: number): string {
    return this.getId(this.config.settings.i18n.terms.footnote, referenceNumber)
  }

  private footnoteReferenceId(referenceNumber: number): string {
    return this.getId(this.config.settings.i18n.terms.footnoteReference, referenceNumber)
  }
}


function attrsFor(node: OutlineSyntaxNode, attrs: any = {}): any {
  if (node.sourceLineNumber) {
    attrs['data-up-source-line'] = node.sourceLineNumber
  }

  return attrs
}


interface AttrsWithPossibleId {
  id?: string
}
