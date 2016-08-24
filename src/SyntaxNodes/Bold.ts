import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


// Equivalent to the `<b>` HTML element.
//
// Not to be confused with `Stress`! 
export class Bold extends RichInlineSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.bold(this)
  }

  protected BOLD(): void { }
}
