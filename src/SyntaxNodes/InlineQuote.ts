import { RevealableInlineSyntaxNode } from './RevealableInlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class InlineQuote extends RevealableInlineSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.inlineQuote(this)
  }

  protected INLINE_QUOTE(): void { }
}
