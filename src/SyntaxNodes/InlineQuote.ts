import { InlineRevealableContent } from './InlineRevealableContent'
import { Renderer } from '../Rendering/Renderer'


export class InlineQuote extends InlineRevealableContent {
  render(renderer: Renderer): string {
    return renderer.inlineQuote(this)
  }

  protected INLINE_QUOTE(): void { }
}
