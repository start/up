import { Document } from '../../SyntaxNodes/Document'
import { InlineDocument } from '../../SyntaxNodes/InlineDocument'
import { Renderer } from '.././Renderer'
import { Link } from '../../SyntaxNodes/Link'
import { Image } from '../../SyntaxNodes/Image'
import { Audio } from '../../SyntaxNodes/Audio'
import { Video } from '../../SyntaxNodes/Video'
import { Text } from '../../SyntaxNodes/Text'
import { Emphasis } from '../../SyntaxNodes/Emphasis'
import { ExampleInput } from '../../SyntaxNodes/ExampleInput'
import { Stress } from '../../SyntaxNodes/Stress'
import { Italics } from '../../SyntaxNodes/Italics'
import { Bold } from '../../SyntaxNodes/Bold'
import { InlineCode } from '../../SyntaxNodes/InlineCode'
import { SectionLink } from '../../SyntaxNodes/SectionLink'
import { NormalParenthetical } from '../../SyntaxNodes/NormalParenthetical'
import { SquareParenthetical } from '../../SyntaxNodes/SquareParenthetical'
import { Highlight } from '../../SyntaxNodes/Highlight'
import { InlineRevealable } from '../../SyntaxNodes/InlineRevealable'
import { RevealableBlock } from '../../SyntaxNodes/RevealableBlock'
import { InlineQuote } from '../../SyntaxNodes/InlineQuote'
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
import { ParentheticalSyntaxNode } from '../../SyntaxNodes/ParentheticalSyntaxNode'
import { htmlElement, htmlElementWithAlreadyEscapedChildren, singleTagHtmlElement, NO_ATTRIBUTE_VALUE } from './HtmlElementHelpers'
import { escapeHtmlContent } from './HtmlEscapingHelpers'
import { patternIgnoringCapitalizationAndStartingWith, either } from '../../PatternHelpers'


export class HtmlRenderer extends Renderer {
  // Our HTML for revealable content doesn't require JavaScript (just CSS), and it works perfectly well for
  // screen-readers.
  //
  // For example, here's our HTML for inline revealable content:
  //
  // <span class="up-revealable">
  //   <label for="up-revealable-1">reveal</label>
  //   <input id="up-revealable-1" role="button" type="checkbox">
  //   <span role="alert">Ash fights Gary</span>
  // </span>
  //
  // This solution requires generating unique IDs to associate each label with its checkbox.
  //
  // To accomplish this, we increment a counter each time we render revealable content (inline or block),
  // appending the counter's value to the checkbox's ID.
  private revealableContentCount: number

  // If a link is nested within another link, we include the inner link's contents directly in the outer link.
  // We don't create an <a> element for the inner link.
  private isInsideLink: boolean

  // One last hack! Within the table of contents itself:
  //
  // 1. No HTML is produced for footnotes. They're ignored.
  // 2. The IDs for inline revealable elements' checkboxes (described above) are given an additional prefix to
  //    prevent clashes with IDs in the document.   
  private isInsideTableOfContents: boolean

  renderDocument(document: Document): string {
    this.reset()
    return this.renderAll(document.children)
  }

  renderInlineDocument(inlineDocument: InlineDocument): string {
    this.reset()
    return this.renderAll(inlineDocument.children)
  }

  renderTableOfContents(tableOfContents: Document.TableOfContents): string {
    this.reset({ isInsideTableOfContents: true })

    return htmlElementWithAlreadyEscapedChildren(
      'nav', [
        this.tableOfContentsTitle(),
        this.tableOfContentsEntries(tableOfContents.entries)
      ],
      { class: classHtmlAttrValue("table-of-contents") })
  }

  blockquote(blockquote: Blockquote): string {
    return this.htmlElement('blockquote', blockquote.children, htmlAttrsFor(blockquote))
  }

  unorderedList(list: UnorderedList): string {
    return htmlElementWithAlreadyEscapedChildren(
      'ul',
      list.items.map(listItem => this.unorderedListItem(listItem)),
      htmlAttrsFor(list))
  }

  orderedList(list: OrderedList): string {
    const attrs: { start?: number, reversed?: any } = {}

    const start = list.start()

    if (start != null) {
      attrs.start = start
    }

    if (list.order() === OrderedList.Order.Descending) {
      attrs.reversed = NO_ATTRIBUTE_VALUE
    }

    return htmlElementWithAlreadyEscapedChildren(
      'ol',
      list.items.map(listItem => this.orderedListItem(listItem)),
      htmlAttrsFor(list, attrs))
  }

  descriptionList(list: DescriptionList): string {
    return htmlElementWithAlreadyEscapedChildren(
      'dl',
      list.items.map(item => this.descriptionListItem(item)),
      htmlAttrsFor(list))
  }

  lineBlock(lineBlock: LineBlock): string {
    const attrs =
      htmlAttrsFor(
        lineBlock,
        { class: classHtmlAttrValue('lines') })

    return htmlElementWithAlreadyEscapedChildren(
      'div',
      lineBlock.lines.map(line => this.line(line)),
      attrs)
  }

  codeBlock(codeBlock: CodeBlock): string {
    return htmlElementWithAlreadyEscapedChildren(
      'pre',
      [htmlElement('code', codeBlock.code)],
      htmlAttrsFor(codeBlock))
  }

  paragraph(paragraph: Paragraph): string {
    return this.htmlElement('p', paragraph.children, htmlAttrsFor(paragraph))
  }

  heading(heading: Heading): string {
    const attrs: { id?: string } = {}

    if (heading.ordinalInTableOfContents) {
      attrs.id = this.htmlIdOfActualEntryInDocument(heading)
    }

    return this.htmlElement(
      'h' + Math.min(6, heading.level),
      heading.children,
      htmlAttrsFor(heading, attrs))
  }

  thematicBreak(thematicBreak: ThematicBreak): string {
    return singleTagHtmlElement('hr', htmlAttrsFor(thematicBreak))
  }

  emphasis(emphasis: Emphasis): string {
    return this.htmlElement('em', emphasis.children)
  }

  stress(stress: Stress): string {
    return this.htmlElement('strong', stress.children)
  }

  italics(italics: Italics): string {
    return this.htmlElement('i', italics.children)
  }

  bold(bold: Bold): string {
    return this.htmlElement('b', bold.children)
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
        : new Italics([new Text(sectionLink.sectionTitleSnippet)])

    return representation.render(this)
  }

  normalParenthetical(normalParenthetical: NormalParenthetical): string {
    return this.parenthetical(normalParenthetical)
  }

  squareParenthetical(squareParenthetical: SquareParenthetical): string {
    return this.parenthetical(squareParenthetical, 'square-brackets')
  }

  highlight(highlight: Highlight): string {
    return this.htmlElement('mark', highlight.children)
  }

  inlineQuote(inlineQuote: InlineQuote): string {
    return this.htmlElement('q', inlineQuote.children)
  }

  inlineRevealable(inlineRevealable: InlineRevealable): string {
    return this.revealable({
      revealableSyntaxNode: inlineRevealable,
      tagNameForGenericContainers: 'span'
    })
  }

  revealableBlock(revealableBlock: RevealableBlock): string {
    return this.revealable({
      revealableSyntaxNode: revealableBlock,
      tagNameForGenericContainers: 'div',
      attrsForOuterContainer: htmlAttrsFor(revealableBlock)
    })
  }

  referenceToFootnote(footnote: Footnote): string {
    if (this.isInsideTableOfContents) {
      // Within the table of contents itself, no HTML is produced for footnotes. They're ignored.   
      return ''
    }

    return this.htmlElement(
      'sup',
      [this.footnoteReferenceInnerLink(footnote)], {
        id: this.footnoteReferenceHtmlId(footnote.referenceNumber),
        class: classHtmlAttrValue('footnote-reference')
      })
  }

  footnoteBlock(footnoteBlock: FootnoteBlock): string {
    const attrs = htmlAttrsFor(
      footnoteBlock, {
        class: classHtmlAttrValue('footnotes')
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
      htmlAttrsFor(table))
  }

  link(link: Link): string {
    if (this.isInsideLink || !this.isUrlAllowed(link.url)) {
      return this.renderAll(link.children)
    }

    this.isInsideLink = true

    const html =
      this.htmlElement('a',
        link.children,
        htmlAttrsFor(link, { href: link.url }))

    this.isInsideLink = false

    return html
  }

  image(image: Image): string {
    if (!this.isUrlAllowed(image.url)) {
      return ''
    }

    const attrs =
      htmlAttrsFor(
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

  text(text: Text): string {
    return escapeHtmlContent(text.text)
  }

  private tableOfContentsTitle(): string {
    const title = new Heading([
      new Text(this.settings.terms.tableOfContents)], { level: 1 })

    return title.render(this)
  }

  private tableOfContentsEntries(entries: Document.TableOfContents.Entry[]): string {
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

  private tableOfContentsEntry(entry: Document.TableOfContents.Entry): OutlineSyntaxNode {
    // Right now, only headings can be table of contents entries, which simplifies this method.
    return new Heading([this.linkToActualEntryInDocument(entry)], { level: entry.level + 1 })
  }

  private linkToActualEntryInDocument(entry: Document.TableOfContents.Entry): Link {
    return new Link(
      entry.contentWithinTableOfContents(),
      fragmentUrl(this.htmlIdOfActualEntryInDocument(entry)))
  }

  private parenthetical(parenthetical: ParentheticalSyntaxNode, ...extraCssClassNames: string[]): string {
    const attrs = {
      class: classHtmlAttrValue('parenthetical', ...extraCssClassNames)
    }

    return this.htmlElement('small', parenthetical.children, attrs)
  }

  private unorderedListItem(listItem: UnorderedList.Item): string {
    return this.htmlElement('li', listItem.children)
  }

  private orderedListItem(listItem: OrderedList.Item): string {
    const attrs: { value?: number } = {}

    if (listItem.ordinal != null) {
      attrs.value = listItem.ordinal
    }

    return this.htmlElement('li', listItem.children, attrs)
  }

  private descriptionListItem(listItem: DescriptionList.Item): string {
    return (
      listItem.subjects.map(subject => this.descriptionSubject(subject)).join('')
      + this.description(listItem.description))
  }

  private descriptionSubject(subject: DescriptionList.Item.Subject): string {
    return this.htmlElement('dt', subject.children)
  }

  private description(description: DescriptionList.Item.Description): string {
    return this.htmlElement('dd', description.children)
  }

  private line(line: LineBlock.Line): string {
    return this.htmlElement('div', line.children)
  }

  private footnoteReferenceInnerLink(footnoteReference: Footnote): Link {
    const referenceNumber = footnoteReference.referenceNumber

    return new Link(
      [new Text(referenceNumber.toString())],
      fragmentUrl(this.footnoteHtmlId(referenceNumber)))
  }

  private footnoteInFootnoteBlock(footnote: Footnote): string {
    const linkBackToReferenceContainer =
      this.htmlElement(
        'dt',
        [this.footnoteLinkBackToReference(footnote)],
        { id: this.footnoteHtmlId(footnote.referenceNumber) })

    const bodyContainer =
      this.htmlElement('dd', footnote.children)

    return linkBackToReferenceContainer + bodyContainer
  }

  private footnoteLinkBackToReference(footnote: Footnote): Link {
    const referenceNumber = footnote.referenceNumber

    return new Link(
      [new Text(referenceNumber.toString())],
      fragmentUrl(this.footnoteReferenceHtmlId(referenceNumber)))
  }

  private playableMediaElement(playableMedia: Audio | Video, tagName: string): string {
    const { url, description } = playableMedia

    if (!this.isUrlAllowed(url)) {
      return ''
    }

    const attrs =
      htmlAttrsFor(
        playableMedia, {
          src: url,
          title: description,
          controls: NO_ATTRIBUTE_VALUE
        })

    return this.htmlElement(tagName, this.playableMediaFallback(description, url), attrs)
  }

  private playableMediaFallback(content: string, url: string): Link[] {
    return [new Link([new Text(content)], url)]
  }

  private revealable(
    args: {
      revealableSyntaxNode: InlineRevealable | RevealableBlock
      tagNameForGenericContainers: string
      attrsForOuterContainer?: any
    }
  ): string {
    let checkBoxIdParts = ['revealable', ++this.revealableContentCount]

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
      htmlElement('label', this.settings.terms.revealContent, { for: checkboxId })

    const revealableContent =
      this.htmlElement(
        args.tagNameForGenericContainers,
        args.revealableSyntaxNode.children,
        { role: 'alert' })

    const attrsForOuterContainer = args.attrsForOuterContainer || {}

    attrsForOuterContainer.class =
      classHtmlAttrValue('revealable')

    return htmlElementWithAlreadyEscapedChildren(
      args.tagNameForGenericContainers,
      [label, checkbox, revealableContent],
      attrsForOuterContainer)
  }

  private tableCaption(caption: Table.Caption): string {
    return (
      caption
        ? htmlElementWithAlreadyEscapedChildren('caption', this.renderEach(caption.children))
        : '')
  }

  private tableHeader(header: Table.Header): string {
    const headerRow =
      htmlElementWithAlreadyEscapedChildren(
        'tr',
        header.cells.map(cell => this.tableHeaderCell(cell, 'col')))

    return htmlElementWithAlreadyEscapedChildren('thead', [headerRow])
  }

  private tableHeaderCell(cell: Table.Header.Cell, scope: 'col' | 'row'): string {
    return this.tableCell('th', cell, { scope })
  }

  private tableRow(row: Table.Row): string {
    const cells =
      row.cells.map(cell => this.tableRowCell(cell))

    if (row.headerColumnCell) {
      cells.unshift(this.tableHeaderCell(row.headerColumnCell, 'row'))
    }

    return htmlElementWithAlreadyEscapedChildren('tr', cells)
  }

  private tableRowCell(cell: Table.Row.Cell): string {
    return this.tableCell('td', cell)
  }

  private tableCell(tagName: string, cell: Table.Cell, attrs: any = {}): string {
    if (cell.isNumeric()) {
      attrs.class = classHtmlAttrValue('numeric')
    }

    if (cell.countColumnsSpanned > 1) {
      attrs.colspan = cell.countColumnsSpanned
    }

    return htmlElementWithAlreadyEscapedChildren(
      tagName,
      this.renderEach(cell.children),
      attrs
    )
  }

  private htmlElement(tagName: string, children: SyntaxNode[], attrs: any = {}): string {
    return htmlElementWithAlreadyEscapedChildren(tagName, this.renderEach(children), attrs)
  }

  private htmlIdOfActualEntryInDocument(entry: Document.TableOfContents.Entry): string {
    return this.idFor(
      this.settings.terms.sectionReferencedByTableOfContents,
      entry.ordinalInTableOfContents)
  }

  private footnoteHtmlId(referenceNumber: number): string {
    return this.idFor(this.settings.terms.footnote, referenceNumber)
  }

  private footnoteReferenceHtmlId(referenceNumber: number): string {
    return this.idFor(this.settings.terms.footnoteReference, referenceNumber)
  }

  private isUrlAllowed(url: string): boolean {
    return this.settings.renderDangerousContent || !UNSAFE_URL_SCHEME.test(url)
  }

  private reset(args?: { isInsideTableOfContents: boolean }): void {
    this.revealableContentCount = 0
    this.isInsideLink = false
    this.isInsideTableOfContents = args && args.isInsideTableOfContents
  }
}


function htmlAttrsFor(node: OutlineSyntaxNode, attrs: any = {}): any {
  if (node.sourceLineNumber) {
    attrs['data-up-source-line'] = node.sourceLineNumber
  }

  return attrs
}

// We always prefix our CSS class names with `up-`, regardless of the `idPrefix` setting.
function classHtmlAttrValue(...classNames: string[]): string {
  return classNames
    .map(className => 'up-' + className)
    .join(' ')
}

function fragmentUrl(id: string): string {
  return '#' + id
}

const UNSAFE_URL_SCHEME =
  patternIgnoringCapitalizationAndStartingWith(
    either(
      'javascript',
      'data',
      'file',
      'vbscript'
    ) + ':')
