import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { Writer } from '../Writing/Writer'


// Equivalent to the `<strong>` HTML element.
//
// Not to be confused with `Bold`! 
export class Stress extends RichInlineSyntaxNode {
  write(writer: Writer): string {
    return writer.stress(this)
  }

  protected STRESS(): void { }
}
