import { RevealableInlineSyntaxNode } from './RevealableInlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class InlineSpoiler extends RevealableInlineSyntaxNode {
  write(writer: Renderer): string {
    return writer.inlineSpoiler(this)
  }

  protected INLINE_SPOILER(): void { }
}
