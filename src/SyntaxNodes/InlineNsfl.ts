import { RevealableInlineSyntaxNode } from './RevealableInlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class InlineNsfl extends RevealableInlineSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.inlineNsfl(this)
  }

  protected INLINE_NSFL(): void { }
}
