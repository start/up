import { Document } from './SyntaxNodes/Document'
import { InlineDocument } from './SyntaxNodes/InlineDocument'
import { Settings } from './Settings'
import { UserProvidedSettings } from './UserProvidedSettings'
import { parse } from './Parsing/parse'
import { parseInline } from './Parsing/parseInline'
import { HtmlRenderer } from './Rendering/Html/HtmlRenderer'


export interface HtmlForDocumentAndTableOfContents {
  documentHtml: string,
  tableOfContentsHtml: string
}


export class Up {
  private settings: Settings

  constructor(settings?: UserProvidedSettings) {
    this.settings = new Settings(settings)
  }

  parseAndRender(markup: string, extraSettings: UserProvidedSettings): string {
    const { parsing, rendering } = getParsingAndRenderingSettings(extraSettings)
    const document = this.parse(markup, parsing)

    return this.render(document, rendering)
  }

  parseAndRenderDocumentAndTableOfContents(markup: string, extraSettings?: UserProvidedSettings): HtmlForDocumentAndTableOfContents {
    const { parsing, rendering } = getParsingAndRenderingSettings(extraSettings)
    const document = this.parse(markup, parsing)

    return this.renderDocumentAndTableOfContents(document, rendering)
  }

  parseAndRenderInline(markup: string, extraSettings?: UserProvidedSettings): string {
    const { parsing, rendering } = getParsingAndRenderingSettings(extraSettings)
    const inlineDocument = this.parseInline(markup, parsing)

    return this.renderInline(inlineDocument, rendering)
  }

  parse(markup: string, extraParsingSettings?: UserProvidedSettings.Parsing): Document {
    return parse(markup, this.getParsingSettings(extraParsingSettings))
  }

  parseInline(markup: string, extraParsingSettings?: UserProvidedSettings.Parsing): InlineDocument {
    return parseInline(markup, this.getParsingSettings(extraParsingSettings))
  }

  render(document: Document, extraRenderingSettings?: UserProvidedSettings.Rendering): string {
    const htmlRenderer = this.getHtmlRenderer(extraRenderingSettings)

    return htmlRenderer.renderDocument(document)
  }

  renderDocumentAndTableOfContents(document: Document, extraRenderingSettings?: UserProvidedSettings.Rendering): HtmlForDocumentAndTableOfContents {
    const htmlRenderer = this.getHtmlRenderer(extraRenderingSettings)

    return {
      documentHtml: htmlRenderer.renderDocument(document),
      tableOfContentsHtml: htmlRenderer.renderTableOfContents(document.tableOfContents)
    }
  }

  renderInline(inlineDocument: InlineDocument, extraRenderingSettings?: UserProvidedSettings.Rendering): string {
    const htmlRenderer = this.getHtmlRenderer(extraRenderingSettings)

    return htmlRenderer.renderInlineDocument(inlineDocument)
  }

  private getParsingSettings(changes?: UserProvidedSettings.Parsing): Settings.Parsing {
    return this.settings.withChanges({ parsing: changes }).parsing
  }

  private getRenderingSettings(changes?: UserProvidedSettings.Rendering): Settings.Rendering {
    return this.settings.withChanges({ rendering: changes }).rendering
  }

  private getHtmlRenderer(extraRenderingSettings: UserProvidedSettings.Rendering): HtmlRenderer {
    return new HtmlRenderer(this.getRenderingSettings(extraRenderingSettings))
  }
}


function getParsingAndRenderingSettings(settings: UserProvidedSettings): UserProvidedSettings {
  return settings || {
    parsing: null,
    rendering: null
  }
}


// This namespace allows developers to use Up without having to create any instances
// of the Up class.
//
// Though it's never necessary to create instances of the Up class, it's sometimes more
// convenient.
//
// For example, let's say you're parsing an article and its comments. For each comment,
// you want to specify a unique ID prefix; for both the article and its comments, you
// want to use custom Japanese terms. 
//
// By creating an instance of the Up class, you can specify those custom Japanese terms
// just once (in the constructor). Then, when parsing each comment, you only need to
// provide a unique ID prefix.
export namespace Up {
  const defaultUp = new Up()

  export function parseAndRender(markup: string, settings?: UserProvidedSettings): string {
    return defaultUp.parseAndRender(markup, settings)
  }

  export function parseAndRenderDocumentAndTableOfContents(markup: string, settings?: UserProvidedSettings): HtmlForDocumentAndTableOfContents {
    return defaultUp.parseAndRenderDocumentAndTableOfContents(markup, settings)
  }

  export function parseAndRenderInline(markup: string, settings?: UserProvidedSettings): string {
    return defaultUp.parseAndRenderInline(markup, settings)
  }

  export function parse(markup: string, parsingSettings?: UserProvidedSettings.Parsing): Document {
    return defaultUp.parse(markup, parsingSettings)
  }

  export function parseInline(markup: string, parsingSettings?: UserProvidedSettings.Parsing): InlineDocument {
    return defaultUp.parseInline(markup, parsingSettings)
  }

  export function render(document: Document, renderingSettings?: UserProvidedSettings.Rendering): string {
    return defaultUp.render(document, renderingSettings)
  }

  export function renderDocumentAndTableOfContents(document: Document, renderingSettings?: UserProvidedSettings.Rendering): HtmlForDocumentAndTableOfContents {
    return defaultUp.renderDocumentAndTableOfContents(document, renderingSettings)
  }

  export function renderInline(inlineDocument: InlineDocument, renderingSettings?: UserProvidedSettings.Rendering): string {
    return defaultUp.renderInline(inlineDocument, renderingSettings)
  }

  // This should always match the `version` field in `package.json`.
  export const VERSION = '20.0.1'
}
