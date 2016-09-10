import { UpDocument } from '../../SyntaxNodes/UpDocument'
import { InlineUpDocument } from '../../SyntaxNodes/InlineUpDocument'
import { Renderer } from '.././Renderer'
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
import { SectionLink } from '../../SyntaxNodes/SectionLink'
import { NormalParenthetical } from '../../SyntaxNodes/NormalParenthetical'
import { SquareParenthetical } from '../../SyntaxNodes/SquareParenthetical'
import { Highlight } from '../../SyntaxNodes/Highlight'
import { InlineSpoiler } from '../../SyntaxNodes/InlineSpoiler'
import { InlineNsfw } from '../../SyntaxNodes/InlineNsfw'
import { InlineNsfl } from '../../SyntaxNodes/InlineNsfl'
import { InlineQuote } from '../../SyntaxNodes/InlineQuote'
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
import { ThematicBreak } from '../../SyntaxNodes/ThematicBreak'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'
import { RevealableInlineSyntaxNode } from '../../SyntaxNodes/RevealableInlineSyntaxNode'
import { RevealableOutlineSyntaxNode } from '../../SyntaxNodes/RevealableOutlineSyntaxNode'
import { ParentheticalSyntaxNode } from '../../SyntaxNodes/ParentheticalSyntaxNode'
import { htmlElement, htmlElementWithAlreadyEscapedChildren, singleTagHtmlElement, classAttrValue, internalUrl, NO_ATTRIBUTE_VALUE } from './ElementHelpers'
import { escapeHtmlContent } from './EscapingHelpers'
import { patternIgnoringCapitalizationAndStartingWith, either } from '../../PatternHelpers'


export class HtmlRenderer extends Renderer {
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
  // Because each Renderer class instance is only used once per document, we can simply increment a counter each
  // time we render a spoiler (inline or block), appending the counter's value to the checkbox's ID.
  //
  // We'll do the same for NSFW and NSFL conventions.
  private spoilerCount: number
  private nsfwCount: number
  private nsflCount: number

  // If a link is nested within another link, we include the inner link's contents directly in the outer link.
  // We don't create an <a> element for the inner link.
  private isInsideLink: boolean

  // One last hack! Within the table of contents itself:
  //
  // 1. No HTML is produced for footnotes. They're ignored.
  // 2. The IDs for inline revealable elements' checkboxes (described above) are given an additional prefix to
  //    prevent clashes with IDs in the document.   
  private isInsideTableOfContents: boolean

  renderDocument(document: UpDocument): string {
    this.reset()
    return this.renderAll(document.children)
  }

  renderInlineDocument(inlineDocument: InlineUpDocument): string {
    this.reset()
    return this.renderAll(inlineDocument.children)
  }

  renderTableOfContents(tableOfContents: UpDocument.TableOfContents): string {
    this.reset({ isInsideTableOfContents: true })

    return htmlElementWithAlreadyEscapedChildren(
      'nav', [
        this.tableOfContentsTitle(),
        this.tableOfContentsEntries(tableOfContents.entries)
      ],
      { class: classAttrValue("table-of-contents") })
  }

  blockquote(blockquote: Blockquote): string {
    return this.element('blockquote', blockquote.children, attrsFor(blockquote))
  }

  unorderedList(list: UnorderedList): string {
    return htmlElementWithAlreadyEscapedChildren(
      'ul',
      list.items.map(listItem => this.unorderedListItem(listItem)),
      attrsFor(list))
  }

  orderedList(list: OrderedList): string {
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

  descriptionList(list: DescriptionList): string {
    return htmlElementWithAlreadyEscapedChildren(
      'dl',
      list.items.map(item => this.descriptionListItem(item)),
      attrsFor(list))
  }

  lineBlock(lineBlock: LineBlock): string {
    const attrs =
      attrsFor(
        lineBlock,
        { class: classAttrValue('lines') })

    return htmlElementWithAlreadyEscapedChildren(
      'div',
      lineBlock.lines.map(line => this.line(line)),
      attrs)
  }

  codeBlock(codeBlock: CodeBlock): string {
    return htmlElementWithAlreadyEscapedChildren(
      'pre',
      [htmlElement('code', codeBlock.code)],
      attrsFor(codeBlock))
  }

  paragraph(paragraph: Paragraph): string {
    return this.element('p', paragraph.children, attrsFor(paragraph))
  }

  heading(heading: Heading): string {
    const attrs: { id?: string } = {}

    if (heading.ordinalInTableOfContents) {
      attrs.id = this.idOfActualEntryInDocument(heading)
    }

    return this.element(
      'h' + Math.min(6, heading.level),
      heading.children,
      attrsFor(heading, attrs))
  }

  thematicBreak(thematicBreak: ThematicBreak): string {
    return singleTagHtmlElement('hr', attrsFor(thematicBreak))
  }

  emphasis(emphasis: Emphasis): string {
    return this.element('em', emphasis.children)
  }

  stress(stress: Stress): string {
    return this.element('strong', stress.children)
  }

  italic(italic: Italic): string {
    return this.element('i', italic.children)
  }

  bold(bold: Bold): string {
    return this.element('b', bold.children)
  }

  inlineCode(inlineCode: InlineCode): string {
    return htmlElement('code', inlineCode.code)
  }

  exampleInput(exampleInput: ExampleInput): string {
    return htmlElement('kbd', exampleInput.input)
  }

  sectionLink(sectionLink: SectionLink): string {
    const { entry } = sectionLink

    const representation =
      entry
        // If this section link is associated with a table of contents entry, let's link to
        // the actual entry in the document.
        ? this.linkToActualEntryInDocument(entry)
        // Otherwise, we'll distinguish its snippet text from the surrounding text by italicizing it.
        : new Italic([new PlainText(sectionLink.sectionTitleSnippet)])

    return representation.render(this)
  }

  normalParenthetical(normalParenthetical: NormalParenthetical): string {
    return this.parenthetical(normalParenthetical)
  }

  squareParenthetical(squareParenthetical: SquareParenthetical): string {
    return this.parenthetical(squareParenthetical, 'square-brackets')
  }

  highlight(highlight: Highlight): string {
    return this.element('mark', highlight.children)
  }

  inlineQuote(inlineQuote: InlineQuote): string {
    return this.element('q', inlineQuote.children)
  }

  inlineSpoiler(inlineSpoiler: InlineSpoiler): string {
    return this.revealable({
      conventionName: 'spoiler',
      termForTogglingVisibility: this.config.terms.toggleSpoiler,
      conventionCount: ++this.spoilerCount,
      revealable: inlineSpoiler,
      tagNameForGenericContainers: 'span'
    })
  }

  inlineNsfw(inlineNsfw: InlineNsfw): string {
    return this.revealable({
      conventionName: 'nsfw',
      termForTogglingVisibility: this.config.terms.toggleNsfw,
      conventionCount: ++this.nsfwCount,
      revealable: inlineNsfw,
      tagNameForGenericContainers: 'span'
    })
  }

  inlineNsfl(inlineNsfl: InlineNsfl): string {
    return this.revealable({
      conventionName: 'nsfl',
      termForTogglingVisibility: this.config.terms.toggleNsfl,
      conventionCount: ++this.nsflCount,
      revealable: inlineNsfl,
      tagNameForGenericContainers: 'span'
    })
  }

  spoilerBlock(spoilerBlock: SpoilerBlock): string {
    return this.revealable({
      conventionName: 'spoiler',
      termForTogglingVisibility: this.config.terms.toggleSpoiler,
      conventionCount: ++this.spoilerCount,
      revealable: spoilerBlock,
      tagNameForGenericContainers: 'div',
      attrsForOuterContainer: attrsFor(spoilerBlock)
    })
  }

  nsfwBlock(nsfwBlock: NsfwBlock): string {
    return this.revealable({
      conventionName: 'nsfw',
      termForTogglingVisibility: this.config.terms.toggleNsfw,
      conventionCount: ++this.nsfwCount,
      revealable: nsfwBlock,
      tagNameForGenericContainers: 'div',
      attrsForOuterContainer: attrsFor(nsfwBlock)
    })
  }

  nsflBlock(nsflBlock: NsflBlock): string {
    return this.revealable({
      conventionName: 'nsfl',
      termForTogglingVisibility: this.config.terms.toggleNsfl,
      conventionCount: ++this.nsflCount,
      revealable: nsflBlock,
      tagNameForGenericContainers: 'div',
      attrsForOuterContainer: attrsFor(nsflBlock)
    })
  }

  referenceToFootnote(footnote: Footnote): string {
    if (this.isInsideTableOfContents) {
      // Within the table of contents itself, no HTML is produced for footnotes. They're ignored.   
      return ''
    }

    return this.element(
      'sup',
      [this.footnoteReferenceInnerLink(footnote)], {
        id: this.footnoteReferenceId(footnote.referenceNumber),
        class: classAttrValue('footnote-reference')
      })
  }

  footnoteBlock(footnoteBlock: FootnoteBlock): string {
    const attrs = attrsFor(
      footnoteBlock, {
        class: classAttrValue('footnotes')
      })

    return htmlElementWithAlreadyEscapedChildren(
      'dl',
      footnoteBlock.footnotes.map(footnote => this.footnoteInFootnoteBlock(footnote)),
      attrs)
  }

  table(table: Table): string {
    return htmlElementWithAlreadyEscapedChildren(
      'table', [
        this.tableCaption(table.caption),
        this.tableHeader(table.header),
        table.rows.map(row => this.tableRow(row)).join('')
      ],
      attrsFor(table))
  }

  link(link: Link): string {
    if (this.isInsideLink || !this.isUrlAllowed(link.url)) {
      return this.renderAll(link.children)
    }

    this.isInsideLink = true

    const html =
      this.element('a',
        link.children,
        attrsFor(link, { href: link.url }))

    this.isInsideLink = false

    return html
  }

  image(image: Image): string {
    if (!this.isUrlAllowed(image.url)) {
      return ''
    }

    const attrs =
      attrsFor(
        image, {
          src: image.url,
          alt: image.description,
          title: image.description
        })

    return singleTagHtmlElement('img', attrs)
  }

  audio(audio: Audio): string {
    return this.playableMediaElement(audio, 'audio')
  }

  video(video: Video): string {
    return this.playableMediaElement(video, 'video')
  }

  plainText(plainText: PlainText): string {
    return escapeHtmlContent(plainText.content)
  }

  private tableOfContentsTitle(): string {
    const title = new Heading([
      new PlainText(this.config.terms.tableOfContents)], { level: 1 })

    return title.render(this)
  }

  private tableOfContentsEntries(entries: UpDocument.TableOfContents.Entry[]): string {
    if (!entries.length) {
      return ''
    }

    const listItems =
      entries.map(entry =>
        new UnorderedList.Item([
          this.tableOfContentsEntry(entry)
        ]))

    return new UnorderedList(listItems).render(this)
  }

  private tableOfContentsEntry(entry: UpDocument.TableOfContents.Entry): OutlineSyntaxNode {
    // Right now, only headings can be table of contents entries, which simplifies this method.
    return new Heading([this.linkToActualEntryInDocument(entry)], { level: entry.level + 1 })
  }

  private linkToActualEntryInDocument(entry: UpDocument.TableOfContents.Entry): Link {
    return new Link(
      entry.representationOfContentWithinTableOfContents(),
      internalUrl(this.idOfActualEntryInDocument(entry)))
  }

  private parenthetical(parenthetical: ParentheticalSyntaxNode, ...extraCssClassNames: string[]): string {
    const attrs = {
      class: classAttrValue('parenthetical', ...extraCssClassNames)
    }

    return this.element('small', parenthetical.children, attrs)
  }

  private unorderedListItem(listItem: UnorderedList.Item): string {
    return this.element('li', listItem.children)
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
      listItem.subjects.map(subject => this.descriptionSubject(subject)).join('')
      + this.description(listItem.description))
  }

  private descriptionSubject(subject: DescriptionList.Item.Subject): string {
    return this.element('dt', subject.children)
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
      internalUrl(this.footnoteId(referenceNumber)))
  }

  private footnoteInFootnoteBlock(footnote: Footnote): string {
    const linkBackToReferenceContainer =
      this.element(
        'dt',
        [this.footnoteLinkBackToReference(footnote)],
        { id: this.footnoteId(footnote.referenceNumber) })

    const bodyContainer =
      this.element('dd', footnote.children)

    return linkBackToReferenceContainer + bodyContainer
  }

  private footnoteLinkBackToReference(footnote: Footnote): Link {
    const referenceNumber = footnote.referenceNumber

    return new Link(
      [new PlainText(referenceNumber.toString())],
      internalUrl(this.footnoteReferenceId(referenceNumber)))
  }

  private playableMediaElement(media: Audio | Video, tagName: string): string {
    const { url, description } = media

    if (!this.isUrlAllowed(url)) {
      return ''
    }

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
    let checkBoxIdParts = [args.conventionName, args.conventionCount]

    // We use this nasty little hack to prevent the IDs of revealable elements' checkboxes
    // within the table of contents from clashing with IDs within the document itself.
    //
    // More information about the HTML for revealable conventions can be found at the top
    // of this class.
    if (this.isInsideTableOfContents) {
      checkBoxIdParts.unshift('toc')
    }

    const checkboxId = this.idFor(...checkBoxIdParts)

    const checkbox =
      singleTagHtmlElement(
        'input', {
          id: checkboxId,
          type: 'checkbox',
          role: 'button'
        })

    const label =
      htmlElement('label', args.termForTogglingVisibility, { for: checkboxId })

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
          'caption', this.renderEach(caption.children))
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
      this.renderEach(cell.children),
      attrs
    )
  }

  private element(tagName: string, children: SyntaxNode[], attrs: any = {}): string {
    return htmlElementWithAlreadyEscapedChildren(tagName, this.renderEach(children), attrs)
  }

  private idOfActualEntryInDocument(entry: UpDocument.TableOfContents.Entry): string {
    return this.idFor(
      this.config.terms.sectionReferencedByTableOfContents,
      entry.ordinalInTableOfContents)
  }

  private footnoteId(referenceNumber: number): string {
    return this.idFor(this.config.terms.footnote, referenceNumber)
  }

  private footnoteReferenceId(referenceNumber: number): string {
    return this.idFor(this.config.terms.footnoteReference, referenceNumber)
  }

  private isUrlAllowed(url: string): boolean {
    return this.config.renderUnsafeContent || !UNSAFE_URL_SCHEME.test(url)
  }

  private reset(args?: { isInsideTableOfContents: boolean }): void {
    this.spoilerCount = 0
    this.nsfwCount = 0
    this.nsflCount = 0
    this.isInsideLink = false
    this.isInsideTableOfContents = args && args.isInsideTableOfContents
  }
}


function attrsFor(node: OutlineSyntaxNode, attrs: any = {}): any {
  if (node.sourceLineNumber) {
    attrs['data-up-source-line'] = node.sourceLineNumber
  }

  return attrs
}

const UNSAFE_URL_SCHEME =
  patternIgnoringCapitalizationAndStartingWith(
    either(
      'javascript',
      'data',
      'file',
      'vbscript'
    ) + ':')
