import { NormalizedSettings } from './NormalizedSettings'
import { parse } from './Parsing/parse'
import { parseInline } from './Parsing/parseInline'
import { HtmlRenderer } from './Rendering/Html/HtmlRenderer'
import { Settings } from './Settings'
import { Document } from './SyntaxNodes/Document'
import { InlineDocument } from './SyntaxNodes/InlineDocument'


export class Up {
  private settings: NormalizedSettings

  constructor(settings?: Settings) {
    this.settings = new NormalizedSettings(settings)
  }

  // Converts Up markup into HTML and returns the result.
  parseAndRender(markup: string, extraSettings?: Settings): string {
    const document = this.parse(markup, extraSettings?.parsing)
    return this.render(document, extraSettings?.rendering)
  }

  // Converts Up markup into two pieces of HTML, both of which are returned:
  //
  // 1. A table of contents
  // 2. The document itself
  parseAndRenderWithTableOfContents(markup: string, extraSettings?: Settings): DocumentAndTableOfContentsHtml {
    const document = this.parse(markup, extraSettings?.parsing)
    return this.renderWithTableOfContents(document, extraSettings?.rendering)
  }

  // Converts inline Up markup into inline HTML and returns the result.
  parseAndRenderInline(inlineMarkup: string, extraSettings?: Settings): string {
    const inlineDocument = this.parseInline(inlineMarkup, extraSettings?.parsing)
    return this.renderInline(inlineDocument, extraSettings?.rendering)
  }

  // Parses Up markup and returns the resulting syntax tree.
  parse(markup: string, extraSettings?: Settings.Parsing): Document {
    return parse(markup, this.getParsingSettings(extraSettings))
  }

  // Parses inline Up markup and returns the resulting inline syntax tree.
  parseInline(inlineMarkup: string, extraSettings?: Settings.Parsing): InlineDocument {
    return parseInline(inlineMarkup, this.getParsingSettings(extraSettings))
  }

  // Converts a syntax tree into HTML, then returns the result.
  render(document: Document, extraSettings?: Settings.Rendering): string {
    const htmlRenderer = this.getHtmlRenderer(extraSettings)
    return htmlRenderer.document(document)
  }

  // Converts a syntax tree into two pieces of HTML, both of which are returned:
  //
  // 1. A table of contents
  // 2. The document itself
  renderWithTableOfContents(document: Document, extraSettings?: Settings.Rendering): DocumentAndTableOfContentsHtml {
    const htmlRenderer = this.getHtmlRenderer(extraSettings)

    return {
      documentHtml: htmlRenderer.document(document),
      tableOfContentsHtml: htmlRenderer.tableOfContents(document.tableOfContents)
    }
  }

  // Converts an inline syntax tree into inline HTML and returns the result.
  renderInline(inlineDocument: InlineDocument, extraSettings?: Settings.Rendering): string {
    const htmlRenderer = this.getHtmlRenderer(extraSettings)
    return htmlRenderer.inlineDocument(inlineDocument)
  }

  private getHtmlRenderer(extraSettings: Settings.Rendering | undefined): HtmlRenderer {
    return new HtmlRenderer(this.getRenderingSettings(extraSettings))
  }

  private getParsingSettings(changes: Settings.Parsing | undefined): NormalizedSettings.Parsing {
    return this.settings.withChanges({ parsing: changes ?? {} }).parsing
  }

  private getRenderingSettings(changes: Settings.Rendering | undefined): NormalizedSettings.Rendering {
    return this.settings.withChanges({ rendering: changes ?? {} }).rendering
  }
}


export interface DocumentAndTableOfContentsHtml {
  documentHtml: string
  tableOfContentsHtml: string
}
