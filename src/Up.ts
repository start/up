import { parseDocument } from './Parsing/ParseDocument'
import { DocumentNode } from './SyntaxNodes/DocumentNode'
import { SyntaxNode } from './SyntaxNodes/SyntaxNode'
import { HtmlWriter } from './Writer/HtmlWriter'
import { UpConfig, UpConfigArgs } from './UpConfig'


// TODO: Accept cofiguration settings in `toAst` and `toHtml`

export class Up {
  private static defaultUp: Up = new Up()
  
  static toAst(text: string): DocumentNode {
    return this.defaultUp.toAst(text)
  }
  
  static toHtml(textOrNode: string | SyntaxNode): string {
    return this.defaultUp.toHtml(textOrNode)
  }
  
  
  private config: UpConfig
  private htmlWriter: HtmlWriter
  
  constructor(config?: UpConfigArgs) {
    this.config = new UpConfig(config)
    this.htmlWriter = new HtmlWriter(this.config)
  }
  
  // TODO: Accept configuration settings here, too
  toAst(text: string): DocumentNode {
    return parseDocument(text, this.config)
  }
  
  // TODO: Accept configuration settings here, too
  toHtml(textOrNode: string | SyntaxNode): string {
    const node =
      typeof textOrNode === 'string'
        ? this.toAst(textOrNode)
        : textOrNode

    return this.htmlWriter.write(node)
  }
}
