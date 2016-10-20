import { Document } from './SyntaxNodes/Document'
import { InlineDocument } from './SyntaxNodes/InlineDocument'
import { NormalizedSettings } from './NormalizedSettings'
import { Settings } from './Settings'
import { parse } from './Parsing/parse'
import { parseInline } from './Parsing/parseInline'
import { HtmlRenderer } from './Rendering/Html/HtmlRenderer'


export class Transformer {
  private settings: NormalizedSettings

  constructor(settings?: Settings) {
    this.settings = new NormalizedSettings(settings)
  }

  // Converts Up markup into HTML and returns the result.
  parseAndRender(markup: string, extraSettings: Settings): string {
    const { parsing, rendering } = getParsingAndRenderingSettings(extraSettings)
    const document = this.parse(markup, parsing)

    return this.render(document, rendering)
  }

  // This method converts Up markup into two pieces of HTML, both of which are returned:
  //
  // 1. A table of contents
  // 2. The document itself
  parseAndRenderDocumentAndTableOfContents(markup: string, extraSettings?: Settings): RenderedDocumentAndTableOfContents {
    const { parsing, rendering } = getParsingAndRenderingSettings(extraSettings)
    const document = this.parse(markup, parsing)

    return this.renderDocumentAndTableOfContents(document, rendering)
  }

  // Converts inline Up markup into inline HTML and returns the result.
  parseAndRenderInline(inlineMarkup: string, extraSettings?: Settings): string {
    const { parsing, rendering } = getParsingAndRenderingSettings(extraSettings)
    const inlineDocument = this.parseInline(inlineMarkup, parsing)

    return this.renderInline(inlineDocument, rendering)
  }

  // Parses Up markup and returns the resulting syntax tree.
  parse(markup: string, extraParsingSettings?: Settings.Parsing): Document {
    return parse(markup, this.getParsingSettings(extraParsingSettings))
  }

  // Parses inline Up markup and returns the resulting inline syntax tree.
  parseInline(inlineMarkup: string, extraParsingSettings?: Settings.Parsing): InlineDocument {
    return parseInline(inlineMarkup, this.getParsingSettings(extraParsingSettings))
  }

  // Converts a syntax tree into HTML, then returns the result.
  render(document: Document, extraRenderingSettings?: Settings.Rendering): string {
    const htmlRenderer = this.getHtmlRenderer(extraRenderingSettings)

    return htmlRenderer.document(document)
  }

  // This method converts a syntax tree into two pieces of HTML, both of which are returned:
  //
  // 1. A table of contents
  // 2. The document itself
  renderDocumentAndTableOfContents(document: Document, extraRenderingSettings?: Settings.Rendering): RenderedDocumentAndTableOfContents {
    const htmlRenderer = this.getHtmlRenderer(extraRenderingSettings)

    return {
      documentHtml: htmlRenderer.document(document),
      tableOfContentsHtml: htmlRenderer.tableOfContents(document.tableOfContents)
    }
  }

  // Converts an inline syntax tree into inline HTML and returns the result.
  renderInline(inlineDocument: InlineDocument, extraRenderingSettings?: Settings.Rendering): string {
    const htmlRenderer = this.getHtmlRenderer(extraRenderingSettings)

    return htmlRenderer.inlineDocument(inlineDocument)
  }

  private getParsingSettings(changes?: Settings.Parsing): NormalizedSettings.Parsing {
    return this.settings.withChanges({ parsing: changes }).parsing
  }

  private getRenderingSettings(changes?: Settings.Rendering): NormalizedSettings.Rendering {
    return this.settings.withChanges({ rendering: changes }).rendering
  }

  private getHtmlRenderer(extraRenderingSettings: Settings.Rendering): HtmlRenderer {
    return new HtmlRenderer(this.getRenderingSettings(extraRenderingSettings))
  }
}


export interface RenderedDocumentAndTableOfContents {
  documentHtml: string,
  tableOfContentsHtml: string
}


function getParsingAndRenderingSettings(settings: Settings): Settings {
  return settings || {
    parsing: null,
    rendering: null
  }
}
