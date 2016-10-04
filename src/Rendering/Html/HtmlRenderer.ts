import * as Up from '../../Up'
import { Renderer } from '.././Renderer'
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
  //   <label for="up-revealable-1" role="button">reveal</label>
  //   <input id="up-revealable-1" type="checkbox">
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

  renderDocument(document: Up.Document): string {
    this.reset()
    return this.renderAll(document.children)
  }

  renderInlineDocument(inlineDocument: Up.InlineDocument): string {
    this.reset()
    return this.renderAll(inlineDocument.children)
  }

  renderTableOfContents(tableOfContents: Up.Document.TableOfContents): string {
    this.reset({ isInsideTableOfContents: true })

    return htmlElementWithAlreadyEscapedChildren(
      'nav', [
        this.tableOfContentsTitle(),
        this.tableOfContentsEntries(tableOfContents.entries)
      ],
      { class: classHtmlAttrValue("table-of-contents") })
  }

  blockquote(blockquote: Up.Blockquote): string {
    return this.htmlElement('blockquote', blockquote.children, htmlAttrsFor(blockquote))
  }

  unorderedList(list: Up.UnorderedList): string {
    return htmlElementWithAlreadyEscapedChildren(
      'ul',
      list.items.map(listItem => this.unorderedListItem(listItem)),
      htmlAttrsFor(list))
  }

  orderedList(list: Up.OrderedList): string {
    const attrs: { start?: number, reversed?: any } = {}

    const start = list.start()

    if (start != null) {
      attrs.start = start
    }

    if (list.order() === Up.OrderedList.Order.Descending) {
      attrs.reversed = NO_ATTRIBUTE_VALUE
    }

    return htmlElementWithAlreadyEscapedChildren(
      'ol',
      list.items.map(listItem => this.orderedListItem(listItem)),
      htmlAttrsFor(list, attrs))
  }

  descriptionList(list: Up.DescriptionList): string {
    return htmlElementWithAlreadyEscapedChildren(
      'dl',
      list.items.map(item => this.descriptionListItem(item)),
      htmlAttrsFor(list))
  }

  lineBlock(lineBlock: Up.LineBlock): string {
    const attrs =
      htmlAttrsFor(
        lineBlock,
        { class: classHtmlAttrValue('lines') })

    return htmlElementWithAlreadyEscapedChildren(
      'div',
      lineBlock.lines.map(line => this.line(line)),
      attrs)
  }

  codeBlock(codeBlock: Up.CodeBlock): string {
    return htmlElementWithAlreadyEscapedChildren(
      'pre',
      [htmlElement('code', codeBlock.code)],
      htmlAttrsFor(codeBlock))
  }

  paragraph(paragraph: Up.Paragraph): string {
    return this.htmlElement('p', paragraph.children, htmlAttrsFor(paragraph))
  }

  heading(heading: Up.Heading): string {
    const attrs: { id?: string } = {}

    if (heading.ordinalInTableOfContents) {
      attrs.id = this.htmlIdOfActualEntryInDocument(heading)
    }

    return this.htmlElement(
      'h' + Math.min(6, heading.level),
      heading.children,
      htmlAttrsFor(heading, attrs))
  }

  thematicBreak(thematicBreak: Up.ThematicBreak): string {
    return singleTagHtmlElement('hr', htmlAttrsFor(thematicBreak))
  }

  emphasis(emphasis: Up.Emphasis): string {
    return this.htmlElement('em', emphasis.children)
  }

  stress(stress: Up.Stress): string {
    return this.htmlElement('strong', stress.children)
  }

  italics(italics: Up.Italics): string {
    return this.htmlElement('i', italics.children)
  }

  bold(bold: Up.Bold): string {
    return this.htmlElement('b', bold.children)
  }

  inlineCode(inlineCode: Up.InlineCode): string {
    return htmlElement('code', inlineCode.code)
  }

  exampleInput(exampleInput: Up.ExampleInput): string {
    return htmlElement('kbd', exampleInput.input)
  }

  sectionLink(sectionLink: Up.SectionLink): string {
    const { entry } = sectionLink

    const representation =
      entry
        // If this section link is associated with a table of contents entry, let's link to
        // the actual entry in the document.
        ? this.linkToActualEntryInDocument(entry)
        // Otherwise, we'll distinguish its snippet text from the surrounding text by italicizing it.
        : new Up.Italics([new Up.Text(sectionLink.sectionTitleSnippet)])

    return representation.render(this)
  }

  normalParenthetical(normalParenthetical: Up.NormalParenthetical): string {
    return this.parenthetical(normalParenthetical)
  }

  squareParenthetical(squareParenthetical: Up.SquareParenthetical): string {
    return this.parenthetical(squareParenthetical, 'square-brackets')
  }

  highlight(highlight: Up.Highlight): string {
    return this.htmlElement('mark', highlight.children)
  }

  inlineQuote(inlineQuote: Up.InlineQuote): string {
    return this.htmlElement('q', inlineQuote.children)
  }

  inlineRevealable(inlineRevealable: Up.InlineRevealable): string {
    return this.revealable({
      revealableSyntaxNode: inlineRevealable,
      tagNameForGenericContainers: 'span'
    })
  }

  revealableBlock(revealableBlock: Up.RevealableBlock): string {
    return this.revealable({
      revealableSyntaxNode: revealableBlock,
      tagNameForGenericContainers: 'div',
      attrsForOuterContainer: htmlAttrsFor(revealableBlock)
    })
  }

  referenceToFootnote(footnote: Up.Footnote): string {
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

  footnoteBlock(footnoteBlock: Up.FootnoteBlock): string {
    const attrs = htmlAttrsFor(
      footnoteBlock, {
        class: classHtmlAttrValue('footnotes')
      })

    return htmlElementWithAlreadyEscapedChildren(
      'dl',
      footnoteBlock.footnotes.map(footnote => this.footnoteInFootnoteBlock(footnote)),
      attrs)
  }

  table(table: Up.Table): string {
    return htmlElementWithAlreadyEscapedChildren(
      'table', [
        this.tableCaption(table.caption),
        this.tableHeader(table.header),
        table.rows.map(row => this.tableRow(row)).join('')
      ],
      htmlAttrsFor(table))
  }

  link(link: Up.Link): string {
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

  image(image: Up.Image): string {
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

  audio(audio: Up.Audio): string {
    return this.playableMediaElement(audio, 'audio')
  }

  video(video: Up.Video): string {
    return this.playableMediaElement(video, 'video')
  }

  text(text: Up.Text): string {
    return escapeHtmlContent(text.text)
  }

  private tableOfContentsTitle(): string {
    const title = new Up.Heading([
      new Up.Text(this.settings.terms.tableOfContents)], { level: 1 })

    return title.render(this)
  }

  private tableOfContentsEntries(entries: Up.Document.TableOfContents.Entry[]): string {
    if (!entries.length) {
      return ''
    }

    const listItems =
      entries.map(entry =>
        new Up.UnorderedList.Item([
          this.tableOfContentsEntry(entry)
        ]))

    return new Up.UnorderedList(listItems).render(this)
  }

  private tableOfContentsEntry(entry: Up.Document.TableOfContents.Entry): Up.OutlineSyntaxNode {
    // Right now, only headings can be table of contents entries, which simplifies this method.
    return new Up.Heading([this.linkToActualEntryInDocument(entry)], { level: entry.level + 1 })
  }

  private linkToActualEntryInDocument(entry: Up.Document.TableOfContents.Entry): Up.Link {
    return new Up.Link(
      entry.contentWithinTableOfContents(),
      fragmentUrl(this.htmlIdOfActualEntryInDocument(entry)))
  }

  private parenthetical(parenthetical: Up.ParentheticalSyntaxNode, ...extraCssClassNames: string[]): string {
    const attrs = {
      class: classHtmlAttrValue('parenthetical', ...extraCssClassNames)
    }

    return this.htmlElement('small', parenthetical.children, attrs)
  }

  private unorderedListItem(listItem: Up.UnorderedList.Item): string {
    return this.htmlElement('li', listItem.children)
  }

  private orderedListItem(listItem: Up.OrderedList.Item): string {
    const attrs: { value?: number } = {}

    if (listItem.ordinal != null) {
      attrs.value = listItem.ordinal
    }

    return this.htmlElement('li', listItem.children, attrs)
  }

  private descriptionListItem(listItem: Up.DescriptionList.Item): string {
    return (
      listItem.subjects.map(subject => this.descriptionSubject(subject)).join('')
      + this.description(listItem.description))
  }

  private descriptionSubject(subject: Up.DescriptionList.Item.Subject): string {
    return this.htmlElement('dt', subject.children)
  }

  private description(description: Up.DescriptionList.Item.Description): string {
    return this.htmlElement('dd', description.children)
  }

  private line(line: Up.LineBlock.Line): string {
    return this.htmlElement('div', line.children)
  }

  private footnoteReferenceInnerLink(footnoteReference: Up.Footnote): Up.Link {
    const referenceNumber = footnoteReference.referenceNumber

    return new Up.Link(
      [new Up.Text(referenceNumber.toString())],
      fragmentUrl(this.footnoteHtmlId(referenceNumber)))
  }

  private footnoteInFootnoteBlock(footnote: Up.Footnote): string {
    const linkBackToReferenceContainer =
      this.htmlElement(
        'dt',
        [this.footnoteLinkBackToReference(footnote)],
        { id: this.footnoteHtmlId(footnote.referenceNumber) })

    const bodyContainer =
      this.htmlElement('dd', footnote.children)

    return linkBackToReferenceContainer + bodyContainer
  }

  private footnoteLinkBackToReference(footnote: Up.Footnote): Up.Link {
    const referenceNumber = footnote.referenceNumber

    return new Up.Link(
      [new Up.Text(referenceNumber.toString())],
      fragmentUrl(this.footnoteReferenceHtmlId(referenceNumber)))
  }

  private playableMediaElement(playableMedia: Up.Audio | Up.Video, tagName: string): string {
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

  private playableMediaFallback(content: string, url: string): Up.Link[] {
    return [new Up.Link([new Up.Text(content)], url)]
  }

  private revealable(
    args: {
      revealableSyntaxNode: Up.InlineRevealable | Up.RevealableBlock
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
          type: 'checkbox'
        })

    const label =
      htmlElement(
        'label',
        this.settings.terms.revealContent, {
          for: checkboxId,
          role: 'button'
        })

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

  private tableCaption(caption: Up.Table.Caption): string {
    return (
      caption
        ? htmlElementWithAlreadyEscapedChildren('caption', this.renderEach(caption.children))
        : '')
  }

  private tableHeader(header: Up.Table.Header): string {
    const headerRow =
      htmlElementWithAlreadyEscapedChildren(
        'tr',
        header.cells.map(cell => this.tableHeaderCell(cell, 'col')))

    return htmlElementWithAlreadyEscapedChildren('thead', [headerRow])
  }

  private tableHeaderCell(cell: Up.Table.Header.Cell, scope: 'col' | 'row'): string {
    return this.tableCell('th', cell, { scope })
  }

  private tableRow(row: Up.Table.Row): string {
    const cells =
      row.cells.map(cell => this.tableRowCell(cell))

    if (row.headerColumnCell) {
      cells.unshift(this.tableHeaderCell(row.headerColumnCell, 'row'))
    }

    return htmlElementWithAlreadyEscapedChildren('tr', cells)
  }

  private tableRowCell(cell: Up.Table.Row.Cell): string {
    return this.tableCell('td', cell)
  }

  private tableCell(tagName: string, cell: Up.Table.Cell, attrs: any = {}): string {
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

  private htmlElement(tagName: string, children: Up.SyntaxNode[], attrs: any = {}): string {
    return htmlElementWithAlreadyEscapedChildren(tagName, this.renderEach(children), attrs)
  }

  private htmlIdOfActualEntryInDocument(entry: Up.Document.TableOfContents.Entry): string {
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


function htmlAttrsFor(node: Up.OutlineSyntaxNode, attrs: any = {}): any {
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
