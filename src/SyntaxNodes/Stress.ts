import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


// Equivalent to the `<strong>` HTML element.
//
// Not to be confused with `Bold`! 
export class Stress extends RichInlineSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.stress(this)
  }

  protected STRESS(): void { }
}
