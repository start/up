import { parseDocument } from './Parsing/parseDocument'
import { DocumentNode } from './SyntaxNodes/DocumentNode'
import { SyntaxNode } from './SyntaxNodes/SyntaxNode'
import { getHtml } from './Writers//Html/getHtml'
import { UpConfig } from './UpConfig'
import { UpConfigSettings } from './UpConfigSettings'


type MarkupOrSyntaxNode = string | DocumentNode


export class Up {
  private config: UpConfig

  constructor(settings?: UpConfigSettings) {
    this.config = new UpConfig(settings)
  }

  toAst(markup: string, extraSettings?: UpConfigSettings): DocumentNode {
    return toAst(markup, this.config.withChanges(extraSettings))
  }

  toHtml(markupOrSyntaxNode: MarkupOrSyntaxNode, extraSettings?: UpConfigSettings): string {
    return toHtml(markupOrSyntaxNode, this.config.withChanges(extraSettings))
  }
}


// This namespace allows developers to use Up without having to create any instances
// of the Up class.
//
// Though it's never necessary to create instances of the Up class, it's sometimes more
// convenient.
//
// For example, let's say you're parsing an article and its comments. You want to use
// custom Japanese terms instead of the default English terms, and you want to specify
// a unique document name for each comment (to prevent ID collisions).
//
// By creating an instance of the Up class, you can specify those custom Japanese terms
// just once (in the constructor). Then, when parsing each comment, you only need to
// provide a unique document name.
export namespace Up {
  const defaultUp = new Up()

  export function toAst(markup: string, settings?: UpConfigSettings): DocumentNode {
    return defaultUp.toAst(markup, settings)
  }

  export function toHtml(markupOrDocumentNode: MarkupOrSyntaxNode, settings?: UpConfigSettings): string {
    return defaultUp.toHtml(markupOrDocumentNode, settings)
  }
}


function toAst(markup: string, config: UpConfig): DocumentNode {
  return parseDocument(markup, config)
}

function toHtml(markupOrDocumentNode: MarkupOrSyntaxNode, config: UpConfig): string {
  const documentNode =
    typeof markupOrDocumentNode === 'string'
      ? toAst(markupOrDocumentNode, config)
      : markupOrDocumentNode

  return getHtml(documentNode, config)
}
