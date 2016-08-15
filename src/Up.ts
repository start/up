import { UpDocument } from './SyntaxNodes/UpDocument'
import { InlineUpDocument } from './SyntaxNodes/InlineUpDocument'
import { Config } from './Config'
import { UserProvidedSettings } from './UserProvidedSettings'
import { parseDocument } from './Parsing/parseDocument'
import { parseInlineDocument } from './Parsing/parseInlineDocument'
import { getHtml } from './Writing//Html/getHtml'


export type MarkupOrDocument = string | UpDocument
export type InlineMarkupOrInlineDocument = string | UpDocument


export class Up {
  private config: Config

  constructor(settings?: UserProvidedSettings) {
    this.config = new Config(settings)
  }

  toDocument(markup: string, extraSettings?: UserProvidedSettings): UpDocument {
    return toDocument(markup, this.config.withChanges(extraSettings))
  }

  toHtml(markupOrDocument: MarkupOrDocument, extraSettings?: UserProvidedSettings): string {
    return toHtml(markupOrDocument, this.config.withChanges(extraSettings))
  }

  toInlineDocument(markup: string, extraSettings?: UserProvidedSettings): InlineUpDocument {
    return toInlineDocument(markup, this.config.withChanges(extraSettings))
  }

  toInlineHtml(markupOrDocument: InlineMarkupOrInlineDocument, extraSettings?: UserProvidedSettings): string {
    return toInlineHtml(markupOrDocument, this.config.withChanges(extraSettings))
  }
}


// This namespace allows developers to use Up without having to create any instances
// of the Up class.
//
// Though it's never necessary to create instances of the Up class, it's sometimes more
// convenient.
//
// For example, let's say you're parsing an article and its comments. For each comment,
// you want to specify a unique document name (to prevent ID collisions). And for both
// the article and its comments, you want to use custom Japanese terms. 
//
// By creating an instance of the Up class, you can specify those custom Japanese terms
// just once (in the constructor). Then, when parsing each comment, you only need to
// provide a unique document name.
export namespace Up {
  const defaultUp = new Up()

  export function toDocument(markup: string, settings?: UserProvidedSettings): UpDocument {
    return defaultUp.toDocument(markup, settings)
  }

  export function toHtml(markupOrDocument: MarkupOrDocument, settings?: UserProvidedSettings): string {
    return defaultUp.toHtml(markupOrDocument, settings)
  }

  export function toInlineDocument(markup: string, settings?: UserProvidedSettings): InlineUpDocument {
    return defaultUp.toInlineDocument(markup, settings)
  }

  export function toInlineHtml(markupOrDocument: InlineMarkupOrInlineDocument, settings?: UserProvidedSettings): string {
    return defaultUp.toInlineHtml(markupOrDocument, settings)
  }
}


function toDocument(markup: string, config: Config): UpDocument {
  return parseDocument(markup, config)
}

function toHtml(markupOrDocument: MarkupOrDocument, config: Config): string {
  const document =
    typeof markupOrDocument === 'string'
      ? toDocument(markupOrDocument, config)
      : markupOrDocument

  return getHtml(document, config)
}

function toInlineDocument(markup: string, config: Config): InlineUpDocument {
  return parseInlineDocument(markup, config)
}

function toInlineHtml(_markupOrDocument: MarkupOrDocument, _config: Config): string {
  throw new Error("Not implemented")
}
