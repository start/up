import { parseDocument } from './Parsing/ParseDocument'
import { DocumentNode } from './SyntaxNodes/DocumentNode'
import { SyntaxNode } from './SyntaxNodes/SyntaxNode'
import { HtmlWriter } from './Writer/HtmlWriter'
import { UpConfig } from './UpConfig'
import { UpConfigArgs } from './UpConfigArgs'


export class Up {
  private static defaultUp: Up = new Up()

  static toAst(text: string, configChanges?: UpConfigArgs): DocumentNode {
    return this.defaultUp.toAst(text, configChanges)
  }

  static toHtml(textOrNode: string | SyntaxNode, configChanges?: UpConfigArgs): string {
    return this.defaultUp.toHtml(textOrNode, configChanges)
  }


  private config: UpConfig

  constructor(config?: UpConfigArgs) {
    this.config = new UpConfig(config)
  }

  toAst(text: string, configChanges?: UpConfigArgs): DocumentNode {
    return toAst(text, this.config.withChanges(configChanges))
  }

  toHtml(textOrNode: string | SyntaxNode, configChanges?: UpConfigArgs): string {
    return toHtml(textOrNode, this.config.withChanges(configChanges))
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