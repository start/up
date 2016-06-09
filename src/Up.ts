import { parseDocument } from './Parsing/parseDocument'
import { DocumentNode } from './SyntaxNodes/DocumentNode'
import { SyntaxNode } from './SyntaxNodes/SyntaxNode'
import { HtmlWriter } from './Writers/HtmlWriter'
import { UpConfig } from './UpConfig'
import { UpConfigSettings } from './UpConfigSettings'


export class Up {
  private static defaultUp: Up = new Up()

  static toAst(text: string, changedSettings?: UpConfigSettings): DocumentNode {
    return this.defaultUp.toAst(text, changedSettings)
  }

  static toHtml(textOrNode: string | SyntaxNode, changedSettings?: UpConfigSettings): string {
    return this.defaultUp.toHtml(textOrNode, changedSettings)
  }


  private config: UpConfig

  constructor(settings?: UpConfigSettings) {
    this.config = new UpConfig(settings)
  }

  toAst(text: string, changedSettings?: UpConfigSettings): DocumentNode {
    return toAst(text, this.config.withChanges(changedSettings))
  }

  toHtml(textOrNode: string | SyntaxNode, changedSettings?: UpConfigSettings): string {
    return toHtml(textOrNode, this.config.withChanges(changedSettings))
  }
}


function toAst(text: string, config: UpConfig): DocumentNode {
  return parseDocument(text, config)
}

function toHtml(textOrNode: string | SyntaxNode, config: UpConfig): string {
  const node =
    typeof textOrNode === 'string'
      ? toAst(textOrNode, config)
      : textOrNode

  return new HtmlWriter(config).write(node)
}
