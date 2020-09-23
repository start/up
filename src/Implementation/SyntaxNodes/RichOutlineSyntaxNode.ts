import { Renderer } from '../Rendering/Renderer'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'


export abstract class RichOutlineSyntaxNode extends OutlineSyntaxNodeContainer implements OutlineSyntaxNode {
  sourceLineNumber?: number

  constructor(
    children: OutlineSyntaxNode[],
    options?: { sourceLineNumber: number }
  ) {
    super(children)
    this.sourceLineNumber = options?.sourceLineNumber
  }

  abstract render(renderer: Renderer): string
}
