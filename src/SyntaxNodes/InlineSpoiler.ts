import { RevealableInlineSyntaxNode } from './RevealableInlineSyntaxNode'
import { Writer } from '../Writing/Writer'


export class InlineSpoiler extends RevealableInlineSyntaxNode {
  write(writer: Writer): string {
    return writer.inlineSpoiler(this)
  }

  protected INLINE_SPOILER(): void { }
}
