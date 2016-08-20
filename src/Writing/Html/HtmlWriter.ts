import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { Writer } from '.././Writer'
import { InlineUpDocument } from '../../SyntaxNodes/InlineUpDocument'
import { Link } from '../../SyntaxNodes/Link'
import { Image } from '../../SyntaxNodes/Image'
import { Audio } from '../../SyntaxNodes/Audio'
import { Video } from '../../SyntaxNodes/Video'
import { PlainText } from '../../SyntaxNodes/PlainText'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { ExampleInput } from '../../SyntaxNodes/ExampleInput'
import { Stress } from '../../SyntaxNodes/Stress'
import { Italic } from '../../SyntaxNodes/Italic'
import { Bold } from '../../SyntaxNodes/Bold'
import { InlineCode } from '../../SyntaxNodes/InlineCode'
import { RevisionInsertion } from '../../SyntaxNodes/RevisionInsertion'
import { RevisionDeletion } from '../../SyntaxNodes/RevisionDeletion'
import { NormalParenthetical } from '../../SyntaxNodes/NormalParenthetical'
import { SquareParenthetical } from '../../SyntaxNodes/SquareParenthetical'
import { Highlight } from '../../SyntaxNodes/Highlight'
import { InlineSpoiler } from '../../SyntaxNodes/InlineSpoiler'
import { InlineNsfw } from '../../SyntaxNodes/InlineNsfw'
import { InlineNsfl } from '../../SyntaxNodes/InlineNsfl'
import { SpoilerBlock } from '../../SyntaxNodes/SpoilerBlock'
import { NsfwBlock } from '../../SyntaxNodes/NsfwBlock'
import { NsflBlock } from '../../SyntaxNodes/NsflBlock'
import { Footnote } from '../../SyntaxNodes/Footnote'
import { FootnoteBlock } from '../../SyntaxNodes/FootnoteBlock'
import { Table } from '../../SyntaxNodes/Table'
import { Paragraph } from '../../SyntaxNodes/Paragraph'
import { Blockquote } from '../../SyntaxNodes/Blockquote'
import { UnorderedList } from '../../SyntaxNodes/UnorderedList'
import { OrderedList } from '../../SyntaxNodes/OrderedList'
import { DescriptionList } from '../../SyntaxNodes/DescriptionList'
import { LineBlock } from '../../SyntaxNodes/LineBlock'
import { Heading } from '../../SyntaxNodes/Heading'
import { CodeBlock } from '../../SyntaxNodes/CodeBlock'
import { OutlineSeparator } from '../../SyntaxNodes/OutlineSeparator'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'
import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { RevealableInlineSyntaxNode } from '../../SyntaxNodes/RevealableInlineSyntaxNode'
import { RevealableOutlineSyntaxNode } from '../../SyntaxNodes/RevealableOutlineSyntaxNode'
import { ParentheticalSyntaxNode } from '../../SyntaxNodes/ParentheticalSyntaxNode'
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
  //   <input id="up-spoiler-1" role="button" type="checkbox">
  //   <span role="alert">Ash fights Gary</span>
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

  protected writeDocument(document: UpDocument): string {
    const tableOfContents =
      document.tableOfContents
        ? this.tableOfContents(document.tableOfContents)
        : ''

    return tableOfContents + this.writeAll(document.children)
  }

  protected writeInlineDocument(inlineDocument: InlineUpDocument): string {
    return this.writeAll(inlineDocument.children)
  }

  protected blockquote(blockquote: Blockquote): string {
    return this.element('blockquote', blockquote.children, attrsFor(blockquote))
  }

  protected unorderedList(list: UnorderedList): string {
    return htmlElementWithAlreadyEscapedChildren(
      'ul',
      list.items.map(listItem => this.unorderedListItem(listItem)),
      attrsFor(list))
  }

  protected orderedList(list: OrderedList): string {
    const attrs: { start?: number, reversed?: any } = {}

    const start = list.start()

    if (start != null) {
      attrs.start = start
    }

    if (list.order() === OrderedList.Order.Descrending) {
      attrs.reversed = NO_ATTRIBUTE_VALUE
    }

    return htmlElementWithAlreadyEscapedChildren(
      'ol',
      list.items.map(listItem => this.orderedListItem(listItem)),
      attrsFor(list, attrs))
  }

  protected descriptionList(list: DescriptionList): string {
    return htmlElementWithAlreadyEscapedChildren(
      'dl',
      list.items.map(item => this.descriptionListItem(item)),
      attrsFor(list))
  }

  protected lineBlock(lineBlock: LineBlock): string {
    const attrs =
      attrsFor(
        lineBlock,
        { class: classAttrValue('lines') })

    return htmlElementWithAlreadyEscapedChildren(
      'div',
      lineBlock.lines.map(line => this.line(line)),
      attrs)
  }

  protected codeBlock(codeBlock: CodeBlock): string {
    return htmlElementWithAlreadyEscapedChildren(
      'pre',
      [htmlElement('code', codeBlock.code)],
      attrsFor(codeBlock))
  }

  protected paragraph(paragraph: Paragraph): string {
    return this.element('p', paragraph.children, attrsFor(paragraph))
  }

  protected heading(heading: Heading, ordinalOfEntryInTableOfContents?: number): string {
    return this.element(
      'h' + Math.min(6, heading.level),
      heading.children,
      this.getAttrsForHeadingPossiblyReferencedByTableOfContents(heading, ordinalOfEntryInTableOfContents))
  }

  protected outlineSeparator(separator: OutlineSeparator): string {
    return singleTagHtmlElement('hr', attrsFor(separator))
  }

  protected emphasis(emphasis: Emphasis): string {
    return this.element('em', emphasis.children)
  }

  protected stress(stress: Stress): string {
    return this.element('strong', stress.children)
  }

  protected italic(italic: Italic): string {
    return this.element('i', italic.children)
  }

  protected bold(bold: Bold): string {
    return this.element('b', bold.children)
  }

  protected inlineCode(inlineCode: InlineCode): string {
    return htmlElement('code', inlineCode.code)
  }

  protected exampleInput(exampleInput: ExampleInput): string {
    return htmlElement('kbd', exampleInput.input)
  }

  protected revisionInsertion(revisionInsertion: RevisionInsertion): string {
    return this.element('ins', revisionInsertion.children)
  }

  protected revisionDeletion(revisionDeletion: RevisionDeletion): string {
    return this.element('del', revisionDeletion.children)
  }

  protected normalParenthetical(normalParenthetical: NormalParenthetical): string {
    return this.parenthetical(normalParenthetical)
  }

  protected squareParenthetical(squareParenthetical: SquareParenthetical): string {
    return this.parenthetical(squareParenthetical, 'square-brackets')
  }

  protected highlight(highlight: Highlight): string {
    return this.element('mark', highlight.children)
  }

  protected inlineSpoiler(inlineSpoiler: InlineSpoiler): string {
    return this.revealable({
      conventionName: 'spoiler',
      termForTogglingVisibility: this.config.terms.toggleSpoiler,
      conventionCount: ++this.spoilerCount,
      revealable: inlineSpoiler,
      tagNameForGenericContainers: 'span'
    })
  }

  protected inlineNsfw(inlineNsfw: InlineNsfw): string {
    return this.revealable({
      conventionName: 'nsfw',
      termForTogglingVisibility: this.config.terms.toggleNsfw,
      conventionCount: ++this.nsfwCount,
      revealable: inlineNsfw,
      tagNameForGenericContainers: 'span'
    })
  }

  protected inlineNsfl(inlineNsfl: InlineNsfl): string {
    return this.revealable({
      conventionName: 'nsfl',
      termForTogglingVisibility: this.config.terms.toggleNsfl,
      conventionCount: ++this.nsflCount,
      revealable: inlineNsfl,
      tagNameForGenericContainers: 'span'
    })
  }

  protected spoilerBlock(spoilerBlock: SpoilerBlock): string {
    return this.revealable({
      conventionName: 'spoiler',
      termForTogglingVisibility: this.config.terms.toggleSpoiler,
      conventionCount: ++this.spoilerCount,
      revealable: spoilerBlock,
      tagNameForGenericContainers: 'div',
      attrsForOuterContainer: attrsFor(spoilerBlock)
    })
  }

  protected nsfwBlock(nsfwBlock: NsfwBlock): string {
    return this.revealable({
      conventionName: 'nsfw',
      termForTogglingVisibility: this.config.terms.toggleNsfw,
      conventionCount: ++this.nsfwCount,
      revealable: nsfwBlock,
      tagNameForGenericContainers: 'div',
      attrsForOuterContainer: attrsFor(nsfwBlock)
    })
  }

  protected nsflBlock(nsflBlock: NsflBlock): string {
    return this.revealable({
      conventionName: 'nsfl',
      termForTogglingVisibility: this.config.terms.toggleNsfl,
      conventionCount: ++this.nsflCount,
      revealable: nsflBlock,
      tagNameForGenericContainers: 'div',
      attrsForOuterContainer: attrsFor(nsflBlock)
    })
  }

  protected footnoteReference(footnote: Footnote): string {
    if (this.isInsideTableOfContents) {
      // Within the table of contents itself, no HTML is produced for footnotes. They're ignored.   
      return ''
    }

    const innerLink = this.footnoteReferenceInnerLink(footnote)

    return this.element(
      'sup',
      [innerLink], {
        id: this.footnoteReferenceId(footnote.referenceNumber),
        class: classAttrValue('footnote-reference')
      })
  }

  protected footnoteBlock(footnoteBlock: FootnoteBlock): string {
    const attrs =
      attrsFor(
        footnoteBlock,
        { class: classAttrValue('footnotes') })

    return htmlElementWithAlreadyEscapedChildren(
      'dl',
      footnoteBlock.footnotes.map(footnote => this.footnote(footnote)),
      attrs)
  }

  protected table(table: Table): string {
    return htmlElementWithAlreadyEscapedChildren(
      'table', [
        this.tableCaption(table.caption),
        this.tableHeader(table.header),
        table.rows.map(row => this.tableRow(row)).join('')
      ])
  }

  protected link(link: Link): string {
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

  protected image(image: Image): string {
    const attrs =
      attrsFor(
        image, {
          src: image.url,
          alt: image.description,
          title: image.description
        })

    return singleTagHtmlElement('img', attrs)
  }

  protected audio(audio: Audio): string {
    return this.playableMediaElement(audio, 'audio')
  }

  protected video(video: Video): string {
    return this.playableMediaElement(video, 'video')
  }

  protected plainText(plainText: PlainText): string {
    return escapeHtmlContent(plainText.content)
  }

  private parenthetical(parenthetical: ParentheticalSyntaxNode, cssClassName?: string): string {
    const attrs =
      cssClassName
        ? { class: classAttrValue(cssClassName) }
        : {}

    return this.element('small', parenthetical.children, attrs)
  }

  private unorderedListItem(listItem: UnorderedList.Item): string {
    return this.element('li', listItem.children)
  }

  private tableOfContents(tableOfContents: UpDocument.TableOfContents): string {
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
      new Heading([
        new PlainText(this.config.terms.tableOfContents)], 1))
  }

  private tableOfContentsEntries(entries: Heading[]): string {
    const listItems =
      entries.map((entry, index) =>
        new UnorderedList.Item([
          this.nodeRepresentingTableOfContentsEntry(entry, index)
        ]))

    return this.write(new UnorderedList(listItems))
  }

  private nodeRepresentingTableOfContentsEntry(entry: Heading, indexOfEntry: number): OutlineSyntaxNode {
    const ordinal = indexOfEntry + 1

    return new Heading(
      [this.linkToElementReferencedByTableOfContents(entry.children, ordinal)],
      entry.level + 1)
  }

  private linkToElementReferencedByTableOfContents(children: InlineSyntaxNode[], ordinalTableOfContentsEntry: number): Link {
    const idOfElement =
      this.idOfElementReferencedByTableOfContents(ordinalTableOfContentsEntry)

    return new Link(children, internalFragmentUrl(idOfElement))
  }

  private orderedListItem(listItem: OrderedList.Item): string {
    const attrs: { value?: number } = {}

    if (listItem.ordinal != null) {
      attrs.value = listItem.ordinal
    }

    return this.element('li', listItem.children, attrs)
  }

  private descriptionListItem(listItem: DescriptionList.Item): string {
    return (
      listItem.terms.map(term => this.descriptionTerm(term)).join('')
      + this.description(listItem.description))
  }

  private descriptionTerm(term: DescriptionList.Item.Term): string {
    return this.element('dt', term.children)
  }

  private description(description: DescriptionList.Item.Description): string {
    return this.element('dd', description.children)
  }

  private line(line: LineBlock.Line): string {
    return this.element('div', line.children)
  }

  private footnoteReferenceInnerLink(footnoteReference: Footnote): Link {
    const referenceNumber = footnoteReference.referenceNumber

    return new Link(
      [new PlainText(referenceNumber.toString())],
      internalFragmentUrl(this.footnoteId(referenceNumber)))
  }

  private footnote(footnote: Footnote): string {
    const termHtml =
      this.element(
        'dt',
        [this.footnoteLinkBackToReference(footnote)],
        { id: this.footnoteId(footnote.referenceNumber) })

    const descriptionHtml =
      this.element('dd', footnote.children)

    return termHtml + descriptionHtml
  }

  private footnoteLinkBackToReference(footnote: Footnote): Link {
    const referenceNumber = footnote.referenceNumber

    return new Link(
      [new PlainText(referenceNumber.toString())],
      internalFragmentUrl(this.footnoteReferenceId(referenceNumber)))
  }

  private playableMediaElement(media: Audio | Video, tagName: string): string {
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

  private playableMediaFallback(content: string, url: string): Link[] {
    return [new Link([new PlainText(content)], url)]
  }

  private revealable(
    args: {
      conventionName: string
      termForTogglingVisibility: string
      conventionCount: number
      revealable: RevealableInlineSyntaxNode | RevealableOutlineSyntaxNode
      tagNameForGenericContainers: string
      attrsForOuterContainer?: any
    }
  ): string {
    const checkboxId = this.getId(args.conventionName, args.conventionCount)

    const label =
      htmlElement('label', args.termForTogglingVisibility, { for: checkboxId })

    const checkbox =
      singleTagHtmlElement(
        'input', {
          id: checkboxId,
          type: 'checkbox',
          role: 'button'
        })

    const revealableContent =
      this.element(
        args.tagNameForGenericContainers,
        args.revealable.children,
        { role: 'alert' })

    const attrsForOuterContainer = args.attrsForOuterContainer || {}

    attrsForOuterContainer.class =
      classAttrValue(args.conventionName, 'revealable')

    return htmlElementWithAlreadyEscapedChildren(
      args.tagNameForGenericContainers,
      [label, checkbox, revealableContent],
      attrsForOuterContainer)
  }

  private tableCaption(caption: Table.Caption): string {
    return (
      caption
        ? htmlElementWithAlreadyEscapedChildren(
          'caption', this.writeEach(caption.children))
        : '')
  }

  private tableHeader(header: Table.Header): string {
    const headerRow =
      htmlElementWithAlreadyEscapedChildren(
        'tr',
        header.cells.map(cell => this.tableHeaderCell(cell, 'col')))

    return htmlElementWithAlreadyEscapedChildren('thead', [headerRow])
  }

  private tableHeaderCell(
    cell: Table.Header.Cell,
    scope: 'col' | 'row'
  ): string {
    return this.tableCell('th', cell, { scope })
  }

  private tableRow(row: Table.Row): string {
    const cells =
      row.cells.map(cell => this.tableRowCell(cell))

    if (row.headerCell) {
      cells.unshift(this.tableHeaderCell(row.headerCell, 'row'))
    }

    return htmlElementWithAlreadyEscapedChildren('tr', cells)
  }

  private tableRowCell(cell: Table.Row.Cell): string {
    const attrs: { class?: string } = {}

    if (cell.isNumeric()) {
      attrs.class = classAttrValue('numeric')
    }

    return this.tableCell('td', cell, attrs)
  }

  private tableCell(tagName: string, cell: Table.Cell, attrs: any = {}): string {
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

  private getAttrsForHeadingPossiblyReferencedByTableOfContents(node: OutlineSyntaxNode, ordinalOfEntryInTableOfContents: number): AttrsWithPossibleId {
    const attrs: AttrsWithPossibleId = {}

    if (ordinalOfEntryInTableOfContents) {
      attrs.id = this.idOfElementReferencedByTableOfContents(ordinalOfEntryInTableOfContents)
    }

    return attrsFor(node, attrs)
  }

  private idOfElementReferencedByTableOfContents(ordinal: number): string {
    return this.getId(this.config.terms.itemReferencedByTableOfContents, ordinal)
  }

  private footnoteId(referenceNumber: number): string {
    return this.getId(this.config.terms.footnote, referenceNumber)
  }

  private footnoteReferenceId(referenceNumber: number): string {
    return this.getId(this.config.terms.footnoteReference, referenceNumber)
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
