import { InlineSyntaxNode } from './InlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class PlainText implements InlineSyntaxNode {
  constructor(public content: string) { }

  textAppearingInline(): string {
    return this.content
  }

  searchableText(): string {
    return this.content
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return []
  }

  render(renderer: Renderer): string {
    return renderer.plainText(this)
  }

  protected PLAIN_TEXT(): void { }
}
