import { parseDocument } from './Parsing/ParseDocument'
import { DocumentNode } from './SyntaxNodes/DocumentNode'
import { SyntaxNode } from './SyntaxNodes/SyntaxNode'
import { HtmlWriter } from './Writer/HtmlWriter'
import { UpConfig } from './UpConfig'
import { UpConfigArgs } from './UpConfigArgs'


// TODO: Accept cofiguration settings in `toAst` and `toHtml`

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
    const config = this.config.withChanges(configChanges)

    return parseDocument(text, config)
  }

  toHtml(textOrNode: string | SyntaxNode, configChanges?: UpConfigArgs): string {
    const node =
      typeof textOrNode === 'string'
        ? this.toAst(textOrNode, configChanges)
        : textOrNode

    const config = this.config.withChanges(configChanges)

    return new HtmlWriter(config).write(node)
  }
}
