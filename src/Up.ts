import { Document } from './SyntaxNodes/Document'
import { InlineDocument } from './SyntaxNodes/InlineDocument'
import { Settings } from './Settings'
import { UserProvidedSettings } from './UserProvidedSettings'
import { parse } from './Parsing/parse'
import { parseInline } from './Parsing/parseInline'
import { HtmlRenderer } from './Rendering/Html/HtmlRenderer'


export class Up {
  private settings: Settings

  constructor(settings?: UserProvidedSettings) {
    this.settings = new Settings(settings)
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

    return htmlRenderer.renderDocument(document)
  }

  // This method converts a syntax tree into two pieces of HTML, both of which are returned:
  //
  // 1. A table of contents
  // 2. The document itself
  renderDocumentAndTableOfContents(document: Document, extraRenderingSettings?: UserProvidedSettings.Rendering): RenderedDocumentAndTableOfContents {
    const htmlRenderer = this.getHtmlRenderer(extraRenderingSettings)

    return {
      documentHtml: htmlRenderer.renderDocument(document),
      tableOfContentsHtml: htmlRenderer.renderTableOfContents(document.tableOfContents)
    }
  }

  // Converts an inline syntax tree into inline HTML and returns the result.
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

  // Converts Up markup into HTML and returns the result.
  export function parseAndRender(markup: string, settings?: UserProvidedSettings): string {
    return defaultUp.parseAndRender(markup, settings)
  }

  // This method converts Up markup into two pieces of HTML, both of which are returned:
  //
  // 1. A table of contents
  // 2. The document itself
  export function parseAndRenderDocumentAndTableOfContents(markup: string, settings?: UserProvidedSettings): RenderedDocumentAndTableOfContents {
    return defaultUp.parseAndRenderDocumentAndTableOfContents(markup, settings)
  }

  // Converts inline Up markup into inline HTML and returns the result.
  export function parseAndRenderInline(inlineMarkup: string, settings?: UserProvidedSettings): string {
    return defaultUp.parseAndRenderInline(inlineMarkup, settings)
  }

  // Parses Up markup and returns the resulting syntax tree.
  export function parse(markup: string, parsingSettings?: UserProvidedSettings.Parsing): Document {
    return defaultUp.parse(markup, parsingSettings)
  }

  // Parses inline Up markup and returns the resulting inline syntax tree.
  export function parseInline(inlineMarkup: string, parsingSettings?: UserProvidedSettings.Parsing): InlineDocument {
    return defaultUp.parseInline(inlineMarkup, parsingSettings)
  }

  // Converts a syntax tree into HTML, then returns the result.
  export function render(document: Document, renderingSettings?: UserProvidedSettings.Rendering): string {
    return defaultUp.render(document, renderingSettings)
  }

  // This method converts a syntax tree into two pieces of HTML, both of which are returned:
  //
  // 1. A table of contents
  // 2. The document itself
  export function renderDocumentAndTableOfContents(document: Document, renderingSettings?: UserProvidedSettings.Rendering): RenderedDocumentAndTableOfContents {
    return defaultUp.renderDocumentAndTableOfContents(document, renderingSettings)
  }

  // Converts an inline syntax tree into inline HTML and returns the result.
  export function renderInline(inlineDocument: InlineDocument, renderingSettings?: UserProvidedSettings.Rendering): string {
    return defaultUp.renderInline(inlineDocument, renderingSettings)
  }

  // This should always match the `version` field in `package.json`.
  export const VERSION = '20.0.1'
}


export interface RenderedDocumentAndTableOfContents {
  documentHtml: string,
  tableOfContentsHtml: string
}


