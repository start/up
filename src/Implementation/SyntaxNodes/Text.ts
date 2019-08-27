import { Renderer } from '../Rendering/Renderer'
import { InlineSyntaxNode } from './InlineSyntaxNode'


export class Text implements InlineSyntaxNode {
  constructor(public text: string) { }

  textAppearingInline(): string {
    return this.text
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return []
  }

  render(renderer: Renderer): string {
    return renderer.text(this)
  }
}
