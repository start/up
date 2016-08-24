import { RevealableInlineSyntaxNode } from './RevealableInlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class InlineNsfl extends RevealableInlineSyntaxNode {
  write(writer: Renderer): string {
    return writer.inlineNsfl(this)
  }

  protected INLINE_NSFL(): void { }
}
