import { DocumentNode } from './SyntaxNodes/DocumentNode'
import { Config } from './Config'
import { UserProvidedSettings } from './UserProvidedSettings'
import { parseDocument } from './Parsing/parseDocument'
import { getHtml } from './Writing//Html/getHtml'


export type MarkupOrDocumentNode = string | DocumentNode


export class Up {
  private config: Config

  constructor(settings?: UserProvidedSettings) {
    this.config = new Config(settings)
  }

  toAst(markup: string, extraSettings?: UserProvidedSettings): DocumentNode {
    return toAst(markup, this.config.withChanges(extraSettings))
  }

  toHtml(markupOrDocumentNode: MarkupOrDocumentNode, extraSettings?: UserProvidedSettings): string {
    return toHtml(markupOrDocumentNode, this.config.withChanges(extraSettings))
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

  export function toAst(markup: string, settings?: UserProvidedSettings): DocumentNode {
    return defaultUp.toAst(markup, settings)
  }

  export function toHtml(markupOrDocumentNode: MarkupOrDocumentNode, settings?: UserProvidedSettings): string {
    return defaultUp.toHtml(markupOrDocumentNode, settings)
  }
}


function toAst(markup: string, config: Config): DocumentNode {
  return parseDocument(markup, config)
}

function toHtml(markupOrDocumentNode: MarkupOrDocumentNode, config: Config): string {
  const document =
    typeof markupOrDocumentNode === 'string'
      ? toAst(markupOrDocumentNode, config)
      : markupOrDocumentNode

  return getHtml(document, config)
}
