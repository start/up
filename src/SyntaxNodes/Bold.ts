import { Renderer } from '../Rendering/Renderer'
import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'


// Equivalent to the `<b>` HTML element.
//
// Not to be confused with `Stress`!
export class Bold extends RichInlineSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.bold(this)
  }

  protected BOLD(): void { }
}
