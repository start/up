import { RevealableOutlineSyntaxNode } from './RevealableOutlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class NsfwBlock extends RevealableOutlineSyntaxNode {
  write(writer: Renderer): string {
    return writer.nsfwBlock(this)
  }

  protected NSFW_BLOCK(): void { }
}
