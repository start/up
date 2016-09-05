import { UpDocument } from './SyntaxNodes/UpDocument'
import { InlineUpDocument } from './SyntaxNodes/InlineUpDocument'
import { Config } from './Config'
import { UserProvidedSettings } from './UserProvidedSettings'
import { parseDocument } from './Parsing/parseDocument'
import { parseInlineDocument } from './Parsing/parseInlineDocument'
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

  toDocument(markup: string, extraSettings?: UserProvidedSettings): UpDocument {
    return parseDocument(markup, this.config.withChanges(extraSettings))
  }

  toHtml(markupOrDocument: MarkupOrDocument, extraSettings?: UserProvidedSettings): string {
    const document =
      this.getDocument(markupOrDocument, extraSettings)

    return new HtmlRenderer(document, this.config.withChanges(extraSettings)).render()
  }

  toHtmlForDocumentAndTableOfContents(markupOrDocument: MarkupOrDocument, extraSettings?: UserProvidedSettings): HtmlForDocumentAndTableOfContents {
    const document =
      this.getDocument(markupOrDocument, extraSettings)

    const htmlRenderer =
      new HtmlRenderer(document, this.config.withChanges(extraSettings))

    return {
      documentHtml: htmlRenderer.render(),
      tableOfContentsHtml: htmlRenderer.tableOfContents(document.tableOfContents)
    }
  }

  toInlineDocument(markup: string, extraSettings?: UserProvidedSettings): InlineUpDocument {
    return parseInlineDocument(markup, this.config.withChanges(extraSettings))
  }

  toInlineHtml(markupOrInlineDocument: MarkupOrInlineDocument, extraSettings?: UserProvidedSettings): string {
    const inlineDocument =
      typeof markupOrInlineDocument === 'string'
        ? this.toInlineDocument(markupOrInlineDocument, extraSettings)
        : markupOrInlineDocument

    return new HtmlRenderer(inlineDocument, this.config.withChanges(extraSettings)).render()
  }

  private getDocument(markupOrDocument: MarkupOrDocument, extraSettings?: UserProvidedSettings): UpDocument {
    return typeof markupOrDocument === 'string'
      ? this.toDocument(markupOrDocument, extraSettings)
      : markupOrDocument
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

  export function toDocument(markup: string, settings?: UserProvidedSettings): UpDocument {
    return defaultUp.toDocument(markup, settings)
  }

  export function toHtml(markupOrDocument: MarkupOrDocument, settings?: UserProvidedSettings): string {
    return defaultUp.toHtml(markupOrDocument, settings)
  }

  export function toHtmlForDocumentAndTableOfContents(markupOrDocument: MarkupOrDocument, settings?: UserProvidedSettings): HtmlForDocumentAndTableOfContents {
    return defaultUp.toHtmlForDocumentAndTableOfContents(markupOrDocument, settings)
  }

  export function toInlineDocument(markup: string, settings?: UserProvidedSettings): InlineUpDocument {
    return defaultUp.toInlineDocument(markup, settings)
  }

  export function toInlineHtml(markupOrInlineDocument: MarkupOrInlineDocument, settings?: UserProvidedSettings): string {
    return defaultUp.toInlineHtml(markupOrInlineDocument, settings)
  }

  // This should always match the `version` field in `package.json`.
  export const VERSION = '13.0.2'
}
