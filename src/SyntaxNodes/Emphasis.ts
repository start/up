import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


// Equivalent to the `<em>` HTML element.
//
// Not to be confused with `Italic`! 
export class Emphasis extends RichInlineSyntaxNode {
  write(writer: Renderer): string {
    return writer.emphasis(this)
  }

  protected EMPHASIS(): void { }
}
