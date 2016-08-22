import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { Writer } from '../Writing/Writer'


export class Highlight extends RichInlineSyntaxNode {
  write(writer: Writer): string {
    return writer.highlight(this)
  }

  protected HIGHLIGHT(): void { }
}
