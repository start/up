import { Renderer } from '../Rendering/Renderer'
import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'


// Equivalent to the `<i>` HTML element.
//
// Not to be confused with `Emphasis`!
export class Italic extends RichInlineSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.italic(this)
  }

  protected readonly ITALIC = undefined
}
