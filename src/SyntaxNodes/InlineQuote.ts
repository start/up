import { Renderer } from '../Rendering/Renderer'
import { InlineRevealable } from './InlineRevealable'


export class InlineQuote extends InlineRevealable {
  render(renderer: Renderer): string {
    return renderer.inlineQuote(this)
  }

  protected INLINE_QUOTE(): void { }
}
