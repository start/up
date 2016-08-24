import { RevealableOutlineSyntaxNode } from './RevealableOutlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class NsfwBlock extends RevealableOutlineSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.nsfwBlock(this)
  }

  protected NSFW_BLOCK(): void { }
}
