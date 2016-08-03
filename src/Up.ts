import { parseDocument } from './Parsing/parseDocument'
import { DocumentNode } from './SyntaxNodes/DocumentNode'
import { SyntaxNode } from './SyntaxNodes/SyntaxNode'
import { HtmlWriter } from './Writers//Html/HtmlWriter'
import { UpConfig } from './UpConfig'
import { UpConfigSettings } from './UpConfigSettings'


export class Up {
  private static default: Up = new Up()

  static toAst(markup: string, settings?: UpConfigSettings): DocumentNode {
    return this.default.toAst(markup, settings)
  }

  static toHtml(markupOrSyntaxNode: string | SyntaxNode, settings?: UpConfigSettings): string {
    return this.default.toHtml(markupOrSyntaxNode, settings)
  }


  private config: UpConfig

  constructor(settings?: UpConfigSettings) {
    this.config = new UpConfig(settings)
  }

  toAst(markup: string, extraSettings?: UpConfigSettings): DocumentNode {
    return toAst(markup, this.config.withChanges(extraSettings))
  }

  toHtml(markupOrSyntaxNode: string | SyntaxNode, extraSettings?: UpConfigSettings): string {
    return toHtml(markupOrSyntaxNode, this.config.withChanges(extraSettings))
  }
}


function toAst(markup: string, config: UpConfig): DocumentNode {
  return parseDocument(markup, config)
}

function toHtml(markupOrSyntaxNode: string | SyntaxNode, config: UpConfig): string {
  const node =
    typeof markupOrSyntaxNode === 'string'
      ? toAst(markupOrSyntaxNode, config)
      : markupOrSyntaxNode

  return new HtmlWriter(config).write(node)
}
