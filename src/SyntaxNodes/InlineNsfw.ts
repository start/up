import { RevealableInlineSyntaxNode } from './RevealableInlineSyntaxNode'
import { Writer } from '../Writing/Writer'


export class InlineNsfw extends RevealableInlineSyntaxNode {
  write(writer: Writer): string {
    return writer.inlineNsfw(this)
  }
  
  protected INLINE_NSFW(): void { }
}
