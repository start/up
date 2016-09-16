import { InlineSyntaxNode } from './InlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class Text implements InlineSyntaxNode {
  constructor(public text: string) { }

  textAppearingInline(): string {
    return this.text
  }

  searchableText(): string {
    return this.text
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return []
  }

  render(renderer: Renderer): string {
    return renderer.text(this)
  }

  protected TEXT(): void { }
}
