import { RevealableInlineSyntaxNode } from './RevealableInlineSyntaxNode'
import { Writer } from '../Writing/Writer'


export class InlineNsfl extends RevealableInlineSyntaxNode {
  write(writer: Writer): string {
    return writer.inlineNsfl(this)
  }

  protected INLINE_NSFL(): void { }
}
