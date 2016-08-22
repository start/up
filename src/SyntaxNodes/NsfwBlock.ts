import { RevealableOutlineSyntaxNode } from './RevealableOutlineSyntaxNode'
import { Writer } from '../Writing/Writer'


export class NsfwBlock extends RevealableOutlineSyntaxNode {
  write(writer: Writer): string {
    return writer.nsfwBlock(this)
  }

  protected NSFW_BLOCK(): void { }
}
