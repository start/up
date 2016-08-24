import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


// Equivalent to the `<i>` HTML element.
//
// Not to be confused with `Emphasis`! 
export class Italic extends RichInlineSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.italic(this)
  }
  
  protected ITALIC(): void { }
}
