import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


// Equivalent to the `<b>` HTML element.
//
// Not to be confused with `Stress`! 
export class Bold extends RichInlineSyntaxNode {
  write(writer: Renderer): string {
    return writer.bold(this)
  }

  protected BOLD(): void { }
}
