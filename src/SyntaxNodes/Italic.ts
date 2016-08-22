import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { Writer } from '../Writing/Writer'


// Equivalent to the `<i>` HTML element.
//
// Not to be confused with `Emphasis`! 
export class Italic extends RichInlineSyntaxNode {
  write(writer: Writer): string {
    return writer.italic(this)
  }
  
  protected ITALIC(): void { }
}
