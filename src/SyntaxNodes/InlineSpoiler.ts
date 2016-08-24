import { RevealableInlineSyntaxNode } from './RevealableInlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class InlineSpoiler extends RevealableInlineSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.inlineSpoiler(this)
  }

  protected INLINE_SPOILER(): void { }
}
