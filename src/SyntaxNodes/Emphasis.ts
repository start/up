import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


// Equivalent to the `<em>` HTML element.
//
// Not to be confused with `Italics`! 
export class Emphasis extends RichInlineSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.emphasis(this)
  }

  protected EMPHASIS(): void { }
}
