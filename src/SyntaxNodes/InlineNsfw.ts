import { RevealableInlineSyntaxNode } from './RevealableInlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class InlineNsfw extends RevealableInlineSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.inlineNsfw(this)
  }
  
  protected INLINE_NSFW(): void { }
}
