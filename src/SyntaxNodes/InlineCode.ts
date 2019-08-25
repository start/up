import { Renderer } from '../Rendering/Renderer'
import { InlineSyntaxNode } from './InlineSyntaxNode'


export class InlineCode implements InlineSyntaxNode {
  constructor(public code: string) { }

  textAppearingInline(): string {
    return this.code
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return []
  }

  render(renderer: Renderer): string {
    return renderer.inlineCode(this)
  }
}
