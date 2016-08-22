import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { Writer } from '../Writing/Writer'


// Equivalent to the `<em>` HTML element.
//
// Not to be confused with `Italic`! 
export class Emphasis extends RichInlineSyntaxNode {
  write(writer: Writer): string {
    return writer.emphasis(this)
  }

  protected EMPHASIS(): void { }
}
