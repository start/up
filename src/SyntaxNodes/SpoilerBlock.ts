import { RevealableOutlineSyntaxNode } from './RevealableOutlineSyntaxNode'
import { Writer } from '../Writing/Writer'


export class SpoilerBlock extends RevealableOutlineSyntaxNode {
  write(writer: Writer): string {
    return writer.spoilerBlock(this)
  }

  protected SPOILER_BLOCK(): void { }
}
