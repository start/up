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

  parse(markup: string, extraSettings?: UserProvidedSettings): UpDocument {
    return parse(markup, this.config.withChanges(extraSettings))
  }

  parseInline(markup: string, extraSettings?: UserProvidedSettings): InlineUpDocument {
    return parseInline(markup, this.config.withChanges(extraSettings))
  }

  renderHtml(markupOrDocument: MarkupOrDocument, extraSettings?: UserProvidedSettings): string {
    const htmlRenderer = this.getHtmlRenderer(extraSettings)

    return htmlRenderer.document(
      this.getDocument(markupOrDocument, extraSettings))
  }

  renderHtmlForDocumentAndTableOfContents(markupOrDocument: MarkupOrDocument, extraSettings?: UserProvidedSettings): HtmlForDocumentAndTableOfContents {
    const htmlRenderer = this.getHtmlRenderer(extraSettings)
    const document = this.getDocument(markupOrDocument, extraSettings)

    return {
      documentHtml: htmlRenderer.document(document),
      tableOfContentsHtml: htmlRenderer.tableOfContents(document.tableOfContents)
    }
  }

  renderInlineHtml(markupOrInlineDocument: MarkupOrInlineDocument, extraSettings?: UserProvidedSettings): string {
    const inlineDocument =
      typeof markupOrInlineDocument === 'string'
        ? this.parseInline(markupOrInlineDocument, extraSettings)
        : markupOrInlineDocument

    return this.getHtmlRenderer(extraSettings).document(inlineDocument)
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

  export function parse(markup: string, settings?: UserProvidedSettings): UpDocument {
    return defaultUp.parse(markup, settings)
  }

  export function parseInline(markup: string, settings?: UserProvidedSettings): InlineUpDocument {
    return defaultUp.parseInline(markup, settings)
  }

  export function renderHtml(markupOrDocument: MarkupOrDocument, settings?: UserProvidedSettings): string {
    return defaultUp.renderHtml(markupOrDocument, settings)
  }

  export function renderHtmlForDocumentAndTableOfContents(markupOrDocument: MarkupOrDocument, settings?: UserProvidedSettings): HtmlForDocumentAndTableOfContents {
    return defaultUp.renderHtmlForDocumentAndTableOfContents(markupOrDocument, settings)
  }

  export function renderInlineHtml(markupOrInlineDocument: MarkupOrInlineDocument, settings?: UserProvidedSettings): string {
    return defaultUp.renderInlineHtml(markupOrInlineDocument, settings)
  }

  // This should always match the `version` field in `package.json`.
  export const VERSION = '17.0.0'
}
