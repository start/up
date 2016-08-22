import { RevealableOutlineSyntaxNode } from './RevealableOutlineSyntaxNode'
import { Writer } from '../Writing/Writer'


export class NsflBlock extends RevealableOutlineSyntaxNode {
  write(writer: Writer): string {
    return writer.nsflBlock(this)
  }

  protected NSFL_BLOCK(): void { }
}
