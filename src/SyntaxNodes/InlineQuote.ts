import { InlineRevealable } from './InlineRevealable'
import { Renderer } from '../Rendering/Renderer'


export class InlineQuote extends InlineRevealable {
  render(renderer: Renderer): string {
    return renderer.inlineQuote(this)
  }

  protected INLINE_QUOTE(): void { }
}
