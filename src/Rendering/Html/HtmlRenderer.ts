import * as Up from '../../Main'
import { Renderer } from '.././Renderer'
import { htmlElement, htmlElementWithAlreadyEscapedChildren, singleTagHtmlElement, EMPTY_ATTRBUTE_VALUE } from './HtmlElementHelpers'
import { escapeHtmlContent } from './HtmlEscapingHelpers'
import { patternIgnoringCapitalizationAndStartingWith, either } from '../../PatternHelpers'


export class HtmlRenderer extends Renderer {
  // Our HTML for revealable content doesn't require JavaScript (just CSS), and it works perfectly well for
  // screen-readers.
  //
  // For example, here's our HTML for inline revealable content:
  //
  // <span class="up-revealable">
  //   <input checked class="up-hide" id="up-hide-button-1" name="up-revealable-1" type="radio">
  //   <label for="up-hide-button-1" role="button" tabindex="0">hide</label>
  //   <input class="up-reveal" id="up-reveal-button-1" name="up-revealable-1" type="radio">
  //   <label for="up-reveal-button-1" role="button" tabindex="0">reveal</label>
  //   <span role="alert">Ash fights Gary</span>
  // </span>
  //
  // This solution requires generating unique IDs to associate each label with its radio button (and a unique
  // name to group the two radio buttons together). To fascilitate this, we increment a counter each time we
  // render revealable content, appending the counter's value to the radio buttons' IDs/names.
  private revealableContentCount: number

  // If a link is nested within another link, we include the inner link's contents directly in the outer link.
  // We don't create an <a> element for the inner link.
  private isInsideLink: boolean

  // One last hack! Within the table of contents itself:
  //
  // 1. No HTML is produced for footnotes. They're ignored.
  // 2. The IDs/names for inline revealable elements' radio buttons (described above) are given an additional
  //    prefix to prevent clashes with IDs in the document.   
  private isInsideTableOfContents: boolean

  document(document: Up.Document): string {
    return this.anyDocument(document)
  }

  inlineDocument(inlineDocument: Up.InlineDocument): string {
    return this.anyDocument(inlineDocument)
  }

  tableOfContents(tableOfContents: Up.Document.TableOfContents): string {
    this.reset({ isInsideTableOfContents: true })

    return this.renderAll(
      tableOfContents.entries.map(entry => this.tableOfContentsEntry(entry)))
  }

  blockquote(blockquote: Up.Blockquote): string {
    return this.htmlElement('blockquote', blockquote.children, htmlAttrsFor(blockquote))
  }

  bulletedList(list: Up.BulletedList): string {
    return htmlElementWithAlreadyEscapedChildren(
      'ul',
      list.items.map(item => this.bulletedListItem(item)),
      htmlAttrsFor(list))
  }

  numberedList(list: Up.NumberedList): string {
    const attrs: { start?: number, reversed?: any } = {}

    const start = list.start()

    if (start != null) {
      attrs.start = start
    }

    if (list.order() === Up.NumberedList.Order.Descending) {
      attrs.reversed = EMPTY_ATTRBUTE_VALUE
    }

    return htmlElementWithAlreadyEscapedChildren(
      'ol',
      list.items.map(item => this.numberedListItem(item)),
      htmlAttrsFor(list, attrs))
  }

  descriptionList(list: Up.DescriptionList): string {
    return htmlElementWithAlreadyEscapedChildren(
      'dl',
      list.items.map(item => this.descriptionListItem(item)),
      htmlAttrsFor(list))
  }

  lineBlock(lineBlock: Up.LineBlock): string {
    const attrs = htmlAttrsFor(
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
    const attrs = htmlAttrsFor(heading)

    if (heading.ordinalInTableOfContents) {
      attrs.id = this.htmlIdOfActualEntryInDocument(heading)
    }

    if (heading.level <= 6) {
      return this.htmlElement('h' + heading.level, heading.children, attrs)
    }

    attrs.role = 'heading'
    attrs['aria-level'] = heading.level

    return this.htmlElement('div', heading.children, attrs)
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

  italic(italic: Up.Italic): string {
    return this.htmlElement('i', italic.children)
  }

  bold(bold: Up.Bold): string {
    return this.htmlElement('b', bold.children)
  }

  inlineCode(inlineCode: Up.InlineCode): string {
    return htmlElement(
      'code',
      inlineCode.code,
      { class: classHtmlAttrValue('inline-code') })
  }

  exampleUserInput(exampleUserInput: Up.ExampleUserInput): string {
    return htmlElement('kbd', exampleUserInput.userInput)
  }

  sectionLink(sectionLink: Up.SectionLink): string {
    const { entry } = sectionLink

    const bestRepresentation =
      entry
        // If this section link is associated with a table of contents entry, let's link
        // to the actual entry in the document.
        ? this.linkToActualEntryInDocument(entry)
        // Otherwise, we'll distinguish this section link's snippet from the surrounding
        // text by italicizing it.
        //
        // TODO: Consider parsing the snippet's markup.
        : new Up.Italic([new Up.Text(sectionLink.markupSnippetFromSectionTitle)])

    return bestRepresentation.render(this)
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
      tagNameForGenericContainer: 'span'
    })
  }

  revealableBlock(revealableBlock: Up.RevealableBlock): string {
    return this.revealable({
      revealableSyntaxNode: revealableBlock,
      tagNameForGenericContainer: 'div',
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
    return this.isUrlAllowed(image.url)
      ? singleTagHtmlElement('img', htmlAttrsFor(
        image, {
          src: image.url,
          alt: image.description,
          title: image.description
        }))
      : ''
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

  private anyDocument(document: Up.Document | Up.InlineDocument): string {
    this.reset()

    return this.renderAll(document.children)
  }

  private tableOfContentsEntry(entry: Up.Document.TableOfContents.Entry): Up.Heading {
    return new Up.Heading(
      [this.linkToActualEntryInDocument(entry)], {
        level: entry.level,
        titleMarkup: entry.titleMarkup,
        sourceLineNumber: entry.sourceLineNumber
      })
  }

  private linkToActualEntryInDocument(entry: Up.Document.TableOfContents.Entry): Up.Link {
    return new Up.Link(
      entry.children,
      fragmentUrl(this.htmlIdOfActualEntryInDocument(entry)))
  }

  private parenthetical(parenthetical: Up.ParentheticalSyntaxNode, ...extraCssClassNames: string[]): string {
    const attrs = {
      class: classHtmlAttrValue('parenthetical', ...extraCssClassNames)
    }

    return this.htmlElement('small', parenthetical.children, attrs)
  }

  private bulletedListItem(listItem: Up.BulletedList.Item): string {
    return this.htmlElement('li', listItem.children)
  }

  private numberedListItem(listItem: Up.NumberedList.Item): string {
    const attrs: { value?: number } = {}

    if (listItem.ordinal != null) {
      attrs.value = listItem.ordinal
    }

    return this.htmlElement('li', listItem.children, attrs)
  }

  private descriptionListItem(listItem: Up.DescriptionList.Item): string {
    return (
      listItem.subjects.map(subject => this.subject(subject)).join('')
      + this.description(listItem.description))
  }

  private subject(subject: Up.DescriptionList.Item.Subject): string {
    return this.htmlElement('dt', subject.children)
  }

  private description(description: Up.DescriptionList.Item.Description): string {
    return this.htmlElement('dd', description.children)
  }

  private line(line: Up.LineBlock.Line): string {
    return this.htmlElement('div', line.children)
  }

  private footnoteReferenceInnerLink(footnote: Up.Footnote): Up.Link {
    const { referenceNumber } = footnote

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
    const { referenceNumber } = footnote

    return new Up.Link(
      [new Up.Text(referenceNumber.toString())],
      fragmentUrl(this.footnoteReferenceHtmlId(referenceNumber)))
  }

  private playableMediaElement(playableMedia: Up.Audio | Up.Video, mediaTagName: string): string {
    const { url, description } = playableMedia

    return this.isUrlAllowed(url)
      ? this.htmlElement(mediaTagName, [this.playableMediaFallback(description, url)], htmlAttrsFor(
        playableMedia, {
          src: url,
          title: description,
          controls: EMPTY_ATTRBUTE_VALUE
        }))
      : ''
  }

  private playableMediaFallback(content: string, url: string): Up.Link {
    return new Up.Link([new Up.Text(content)], url)
  }

  private revealable(
    args: {
      revealableSyntaxNode: Up.InlineRevealable | Up.RevealableBlock
      tagNameForGenericContainer: string
      attrsForOuterContainer?: any
    }
  ): string {
    const revealableIdFor = (...parts: any[]) => {
      // We use this hack to prevent the ID/name collisions of revealable elements within the
      // table of contents from clashing with the ID/names of the revealable elements within the
      // document itself.
      if (this.isInsideTableOfContents) {
        parts.unshift('toc')
      }

      return this.idFor(...parts)
    }

    // In the comment at the top of this class, you can see the HTML this method produces.

    const revealableContentOrdinal =
      ++this.revealableContentCount

    let buttonGroupName =
      revealableIdFor('revealable', revealableContentOrdinal)

    let hideButtonId =
      revealableIdFor('hide', 'button', revealableContentOrdinal)

    let revealButtonId =
      revealableIdFor('reveal', 'button', revealableContentOrdinal)

    const radioButtonHide = singleTagHtmlElement(
      'input', {
        type: 'radio',
        id: hideButtonId,
        name: buttonGroupName,
        class: classHtmlAttrValue('hide'),
        checked: EMPTY_ATTRBUTE_VALUE
      })

    const radioButtonReveal = singleTagHtmlElement(
      'input', {
        type: 'radio',
        id: revealButtonId,
        name: buttonGroupName,
        class: classHtmlAttrValue('reveal')
      })

    const labelHtmlElement = (id: string, text: string) =>
      htmlElement(
        'label',
        text, {
          for: id,
          role: 'button',
          tabindex: 0
        })

    const { terms } = this.settings

    const labelHide = labelHtmlElement(hideButtonId, terms.hide)
    const labelReveal = labelHtmlElement(revealButtonId, terms.reveal)

    const revealableContent =
      this.htmlElement(
        args.tagNameForGenericContainer,
        args.revealableSyntaxNode.children,
        { role: 'alert' })

    const attrsForOuterContainer = args.attrsForOuterContainer || {}

    attrsForOuterContainer.class =
      classHtmlAttrValue('revealable')

    return htmlElementWithAlreadyEscapedChildren(
      args.tagNameForGenericContainer, [
        radioButtonHide,
        labelHide,
        radioButtonReveal,
        labelReveal,
        revealableContent
      ],
      attrsForOuterContainer)
  }

  private tableCaption(caption: Up.Table.Caption | undefined): string {
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
    this.isInsideTableOfContents = (args != null) && args.isInsideTableOfContents
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
