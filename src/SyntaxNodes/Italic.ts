import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


// Equivalent to the `<i>` HTML element.
//
// Not to be confused with `Emphasis`! 
export class Italic extends RichInlineSyntaxNode {
  write(writer: Renderer): string {
    return writer.italic(this)
  }
  
  protected ITALIC(): void { }
}
