import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


// Equivalent to the `<i>` HTML element.
//
// Not to be confused with `Emphasis`! 
export class Italics extends RichInlineSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.italics(this)
  }

  protected ITALICS(): void { }
}
