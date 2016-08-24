import { InlineSyntaxNode } from './InlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class InlineCode implements InlineSyntaxNode {
  constructor(public code: string) { }

  textAppearingInline(): string {
    return this.code
  }

  searchableText(): string {
    return this.code
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return []
  }

  render(renderer: Renderer): string {
    return renderer.inlineCode(this)
  }
}
