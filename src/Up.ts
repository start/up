import { UpDocument } from './SyntaxNodes/UpDocument'
import { InlineUpDocument } from './SyntaxNodes/InlineUpDocument'
import { Config } from './Config'
import { UserProvidedSettings } from './UserProvidedSettings'
import { parse } from './Parsing/parse'
import { parseInline } from './Parsing/parseInline'
import { HtmlRenderer } from './Rendering/Html/HtmlRenderer'


export interface HtmlForDocumentAndTableOfContents {
  documentHtml: string,
  tableOfContentsHtml: string
}


export class Up {
  private config: Config

  constructor(settings?: UserProvidedSettings) {
    this.config = new Config(settings)
  }

  parseAndRender(markup: string, extraSettings?: UserProvidedSettings): string {
    const document = this.parse(markup, extraSettings.parsing)

    return this.render(document, extraSettings.rendering)
  }

  parseAndRenderDocumentAndTableOfContents(markup: string, extraSettings?: UserProvidedSettings): HtmlForDocumentAndTableOfContents {
    const document = this.parse(markup, extraSettings.parsing)

    return this.renderDocumentAndTableOfContents(document, extraSettings.rendering)
  }

  parseAndRenderInline(markup: string, extraSettings?: UserProvidedSettings): string {
    const inlineDocument = this.parseInline(markup, extraSettings.parsing)

    return this.renderInline(inlineDocument, extraSettings.rendering)
  }

  parse(markup: string, extraParsingSettings?: UserProvidedSettings.Parsing): UpDocument {
    return parse(markup, this.getParsingConfig(extraParsingSettings))
  }

  parseInline(markup: string, extraParsingSettings?: UserProvidedSettings.Parsing): InlineUpDocument {
    return parseInline(markup, this.getParsingConfig(extraParsingSettings))
  }

  render(document: UpDocument, extraRenderingSettings?: UserProvidedSettings.Rendering): string {
    const htmlRenderer = this.getHtmlRenderer(extraRenderingSettings)

    return htmlRenderer.renderDocument(document)
  }

  renderDocumentAndTableOfContents(document: UpDocument, extraRenderingSettings?: UserProvidedSettings.Rendering): HtmlForDocumentAndTableOfContents {
    const htmlRenderer = this.getHtmlRenderer(extraRenderingSettings)

    return {
      documentHtml: htmlRenderer.renderDocument(document),
      tableOfContentsHtml: htmlRenderer.renderTableOfContents(document.tableOfContents)
    }
  }

  renderInline(inlineDocument: InlineUpDocument, extraRenderingSettings?: UserProvidedSettings.Rendering): string {
    const htmlRenderer = this.getHtmlRenderer(extraRenderingSettings)

    return htmlRenderer.renderInlineDocument(inlineDocument)
  }

  private getParsingConfig(changes?: UserProvidedSettings.Parsing): Config.Parsing {
    return this.config.withChanges({ parsing: changes }).parsing
  }

  private getRenderingConfig(changes?: UserProvidedSettings.Rendering): Config.Rendering {
    return this.config.withChanges({ rendering: changes }).rendering
  }

  private getHtmlRenderer(extraRenderingSettings: UserProvidedSettings.Rendering): HtmlRenderer {
    return new HtmlRenderer(this.getRenderingConfig(extraRenderingSettings))
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

  export function parse(markup: string, parsingSettings?: UserProvidedSettings.Parsing): UpDocument {
    return defaultUp.parse(markup, parsingSettings)
  }

  export function parseInline(markup: string, parsingSettings?: UserProvidedSettings.Parsing): InlineUpDocument {
    return defaultUp.parseInline(markup, parsingSettings)
  }

  export function render(document: UpDocument, renderingSettings?: UserProvidedSettings.Rendering): string {
    return defaultUp.render(document, renderingSettings)
  }

  export function renderDocumentAndTableOfContents(document: UpDocument, renderingSettings?: UserProvidedSettings.Rendering): HtmlForDocumentAndTableOfContents {
    return defaultUp.renderDocumentAndTableOfContents(document, renderingSettings)
  }

  export function renderInline(inlineDocument: InlineUpDocument, renderingSettings?: UserProvidedSettings.Rendering): string {
    return defaultUp.renderInline(inlineDocument, renderingSettings)
  }

  // This should always match the `version` field in `package.json`.
  export const VERSION = '18.0.0'
}
