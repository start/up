import { parseDocument } from './Parsing/parseDocument'
import { DocumentNode } from './SyntaxNodes/DocumentNode'
import { SyntaxNode } from './SyntaxNodes/SyntaxNode'
import { HtmlWriter } from './Writers//Html/HtmlWriter'
import { UpConfig } from './UpConfig'
import { UpConfigSettings } from './UpConfigSettings'


export class Up {
  private static defaultUp: Up = new Up()

  static toAst(markup: string, changedSettings?: UpConfigSettings): DocumentNode {
    return this.defaultUp.toAst(markup, changedSettings)
  }

  static toHtml(markupOrSyntaxNode: string | SyntaxNode, changedSettings?: UpConfigSettings): string {
    return this.defaultUp.toHtml(markupOrSyntaxNode, changedSettings)
  }


  private config: UpConfig

  constructor(settings?: UpConfigSettings) {
    this.config = new UpConfig(settings)
  }

  toAst(markup: string, changedSettings?: UpConfigSettings): DocumentNode {
    return toAst(markup, this.config.withChanges(changedSettings))
  }

  toHtml(markupOrSyntaxNode: string | SyntaxNode, changedSettings?: UpConfigSettings): string {
    return toHtml(markupOrSyntaxNode, this.config.withChanges(changedSettings))
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
