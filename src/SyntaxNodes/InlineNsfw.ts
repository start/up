import { RevealableInlineSyntaxNode } from './RevealableInlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class InlineNsfw extends RevealableInlineSyntaxNode {
  write(writer: Renderer): string {
    return writer.inlineNsfw(this)
  }
  
  protected INLINE_NSFW(): void { }
}
