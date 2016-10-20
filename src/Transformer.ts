import { Document } from './SyntaxNodes/Document'
import { InlineDocument } from './SyntaxNodes/InlineDocument'
import { NormalizedSettings } from './NormalizedSettings'
import { UserProvidedSettings } from './UserProvidedSettings'
import { parse } from './Parsing/parse'
import { parseInline } from './Parsing/parseInline'
import { HtmlRenderer } from './Rendering/Html/HtmlRenderer'


export class Transformer {
  private settings: NormalizedSettings

  constructor(settings?: UserProvidedSettings) {
    this.settings = new NormalizedSettings(settings)
  }

  // Converts Up markup into HTML and returns the result.
  parseAndRender(markup: string, extraSettings: UserProvidedSettings): string {
    const { parsing, rendering } = getParsingAndRenderingSettings(extraSettings)
    const document = this.parse(markup, parsing)

    return this.render(document, rendering)
  }

  // This method converts Up markup into two pieces of HTML, both of which are returned:
  //
  // 1. A table of contents
  // 2. The document itself
  parseAndRenderDocumentAndTableOfContents(markup: string, extraSettings?: UserProvidedSettings): RenderedDocumentAndTableOfContents {
    const { parsing, rendering } = getParsingAndRenderingSettings(extraSettings)
    const document = this.parse(markup, parsing)

    return this.renderDocumentAndTableOfContents(document, rendering)
  }

  // Converts inline Up markup into inline HTML and returns the result.
  parseAndRenderInline(inlineMarkup: string, extraSettings?: UserProvidedSettings): string {
    const { parsing, rendering } = getParsingAndRenderingSettings(extraSettings)
    const inlineDocument = this.parseInline(inlineMarkup, parsing)

    return this.renderInline(inlineDocument, rendering)
  }

  // Parses Up markup and returns the resulting syntax tree.
  parse(markup: string, extraParsingSettings?: UserProvidedSettings.Parsing): Document {
    return parse(markup, this.getParsingSettings(extraParsingSettings))
  }

  // Parses inline Up markup and returns the resulting inline syntax tree.
  parseInline(inlineMarkup: string, extraParsingSettings?: UserProvidedSettings.Parsing): InlineDocument {
    return parseInline(inlineMarkup, this.getParsingSettings(extraParsingSettings))
  }

  // Converts a syntax tree into HTML, then returns the result.
  render(document: Document, extraRenderingSettings?: UserProvidedSettings.Rendering): string {
    const htmlRenderer = this.getHtmlRenderer(extraRenderingSettings)

    return htmlRenderer.document(document)
  }

  // This method converts a syntax tree into two pieces of HTML, both of which are returned:
  //
  // 1. A table of contents
  // 2. The document itself
  renderDocumentAndTableOfContents(document: Document, extraRenderingSettings?: UserProvidedSettings.Rendering): RenderedDocumentAndTableOfContents {
    const htmlRenderer = this.getHtmlRenderer(extraRenderingSettings)

    return {
      documentHtml: htmlRenderer.document(document),
      tableOfContentsHtml: htmlRenderer.tableOfContents(document.tableOfContents)
    }
  }

  // Converts an inline syntax tree into inline HTML and returns the result.
  renderInline(inlineDocument: InlineDocument, extraRenderingSettings?: UserProvidedSettings.Rendering): string {
    const htmlRenderer = this.getHtmlRenderer(extraRenderingSettings)

    return htmlRenderer.inlineDocument(inlineDocument)
  }

  private getParsingSettings(changes?: UserProvidedSettings.Parsing): NormalizedSettings.Parsing {
    return this.settings.withChanges({ parsing: changes }).parsing
  }

  private getRenderingSettings(changes?: UserProvidedSettings.Rendering): NormalizedSettings.Rendering {
    return this.settings.withChanges({ rendering: changes }).rendering
  }

  private getHtmlRenderer(extraRenderingSettings: UserProvidedSettings.Rendering): HtmlRenderer {
    return new HtmlRenderer(this.getRenderingSettings(extraRenderingSettings))
  }
}


export interface RenderedDocumentAndTableOfContents {
  documentHtml: string,
  tableOfContentsHtml: string
}


function getParsingAndRenderingSettings(settings: UserProvidedSettings): UserProvidedSettings {
  return settings || {
    parsing: null,
    rendering: null
  }
}
