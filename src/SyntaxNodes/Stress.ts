import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


// Equivalent to the `<strong>` HTML element.
//
// Not to be confused with `Bold`! 
export class Stress extends RichInlineSyntaxNode {
  write(writer: Renderer): string {
    return writer.stress(this)
  }

  protected STRESS(): void { }
}
