import { RichOutlineSyntaxNode } from './RichOutlineSyntaxNode'
import { Writer } from '../Writing/Writer'


export class Blockquote extends RichOutlineSyntaxNode {
  write(writer: Writer): string {
    return writer.blockquote(this)
  }

  protected BLOCKQUOTE(): void { }
}
