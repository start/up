import { Renderer } from '../Rendering/Renderer'
import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'


// Equivalent to the `<em>` HTML element.
//
// Not to be confused with `Italic`!
export class Emphasis extends RichInlineSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.emphasis(this)
  }

  protected readonly EMPHASIS = undefined
}
