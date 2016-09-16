import { InlineSyntaxNode } from './InlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class PlainText implements InlineSyntaxNode {
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
    return renderer.plainText(this)
  }

  protected PLAIN_TEXT(): void { }
}
