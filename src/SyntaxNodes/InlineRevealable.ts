import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


// A "revealable" convention is one that requires deliberate action from the reader to reveal.
export class InlineRevealable extends RichInlineSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.inlineRevealable(this)
  }

  protected INLINE_REVEALABLE_CONTENT(): void { }
}
