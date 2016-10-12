import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class InlineRevealable extends RichInlineSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.inlineRevealable(this)
  }

  protected INLINE_REVEALABLE(): void { }
}
