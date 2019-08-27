import { Renderer } from '../Rendering/Renderer'
import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'


export class InlineRevealable extends RichInlineSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.inlineRevealable(this)
  }

  protected INLINE_REVEALABLE(): void { }
}
