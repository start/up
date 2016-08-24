import { RevealableOutlineSyntaxNode } from './RevealableOutlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class SpoilerBlock extends RevealableOutlineSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.spoilerBlock(this)
  }

  protected SPOILER_BLOCK(): void { }
}
