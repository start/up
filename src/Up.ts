import { UpDocument } from './SyntaxNodes/UpDocument'
import { InlineUpDocument } from './SyntaxNodes/InlineUpDocument'
import { Config } from './Config'
import { UserProvidedSettings } from './UserProvidedSettings'
import { parse } from './Parsing/parse'
import { parseInline } from './Parsing/parseInline'
import { HtmlRenderer } from './Rendering/Html/HtmlRenderer'


export type MarkupOrDocument = string | UpDocument
export type MarkupOrInlineDocument = string | InlineUpDocument

export interface HtmlForDocumentAndTableOfContents {
  documentHtml: string,
  tableOfContentsHtml: string
}


export class Up {
  private config: Config

  constructor(settings?: UserProvidedSettings) {
    this.config = new Config(settings)
  }

  render(markupOrDocument: MarkupOrDocument, extraSettings?: UserProvidedSettings): string {
    const htmlRenderer = this.getHtmlRenderer(extraSettings)

    return htmlRenderer.document(
      this.getDocument(markupOrDocument, extraSettings))
  }

  renderDocumentAndTableOfContents(markupOrDocument: MarkupOrDocument, extraSettings?: UserProvidedSettings): HtmlForDocumentAndTableOfContents {
    const htmlRenderer = this.getHtmlRenderer(extraSettings)
    const document = this.getDocument(markupOrDocument, extraSettings)

    return {
      documentHtml: htmlRenderer.document(document),
      tableOfContentsHtml: htmlRenderer.tableOfContents(document.tableOfContents)
    }
  }

  renderInline(markupOrInlineDocument: MarkupOrInlineDocument, extraSettings?: UserProvidedSettings): string {
    const inlineDocument =
      typeof markupOrInlineDocument === 'string'
        ? this.parseInline(markupOrInlineDocument, extraSettings)
        : markupOrInlineDocument

    return this.getHtmlRenderer(extraSettings).document(inlineDocument)
  }

  parse(markup: string, extraSettings?: UserProvidedSettings.Parsing): UpDocument {
    return parse(markup, this.getConfigWithUpdatedParsingSettings(extraSettings))
  }

  parseInline(markup: string, extraSettings?: UserProvidedSettings.Parsing): InlineUpDocument {
    return parseInline(markup, this.getConfigWithUpdatedParsingSettings(extraSettings))
  }

  private getConfigWithUpdatedParsingSettings(extraSettings?: UserProvidedSettings.Parsing): Config {
    return this.config.withChanges({ parsing: extraSettings })
  }

  private getDocument(markupOrDocument: MarkupOrDocument, extraSettings?: UserProvidedSettings): UpDocument {
    return typeof markupOrDocument === 'string'
      ? this.parse(markupOrDocument, extraSettings)
      : markupOrDocument
  }

  private getHtmlRenderer(extraSettings: UserProvidedSettings) {
    return new HtmlRenderer(this.config.withChanges(extraSettings))
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

  export function render(markupOrDocument: MarkupOrDocument, settings?: UserProvidedSettings): string {
    return defaultUp.render(markupOrDocument, settings)
  }

  export function renderDocumentAndTableOfContents(markupOrDocument: MarkupOrDocument, settings?: UserProvidedSettings): HtmlForDocumentAndTableOfContents {
    return defaultUp.renderDocumentAndTableOfContents(markupOrDocument, settings)
  }

  export function renderInline(markupOrInlineDocument: MarkupOrInlineDocument, settings?: UserProvidedSettings): string {
    return defaultUp.renderInline(markupOrInlineDocument, settings)
  }

  export function parse(markup: string, settings?: UserProvidedSettings.Parsing): UpDocument {
    return defaultUp.parse(markup, settings)
  }

  export function parseInline(markup: string, settings?: UserProvidedSettings.Parsing): InlineUpDocument {
    return defaultUp.parseInline(markup, settings)
  }

  // This should always match the `version` field in `package.json`.
  export const VERSION = '18.0.0'
}
