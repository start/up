import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'
import { Renderer } from '../Rendering/Renderer'


export abstract class RichOutlineSyntaxNode extends OutlineSyntaxNodeContainer implements OutlineSyntaxNode {
  public sourceLineNumber: number = undefined

  constructor(children: OutlineSyntaxNode[], options?: { sourceLineNumber: number }) {
    super(children)

    if (options) {
      this.sourceLineNumber = options.sourceLineNumber
    }
  }

  abstract render(renderer: Renderer): string
}
