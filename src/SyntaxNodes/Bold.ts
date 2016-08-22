import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { Writer } from '../Writing/Writer'


// Equivalent to the `<b>` HTML element.
//
// Not to be confused with `Stress`! 
export class Bold extends RichInlineSyntaxNode {
  write(writer: Writer): string {
    return writer.bold(this)
  }

  protected BOLD(): void { }
}
