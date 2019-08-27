import { Renderer } from '../Rendering/Renderer'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'


export abstract class RichOutlineSyntaxNode extends OutlineSyntaxNodeContainer implements OutlineSyntaxNode {
  sourceLineNumber: number | undefined = undefined

  constructor(children: OutlineSyntaxNode[], options?: { sourceLineNumber: number }) {
    super(children)

    if (options) {
      this.sourceLineNumber = options.sourceLineNumber
    }
  }

  abstract render(renderer: Renderer): string
}
