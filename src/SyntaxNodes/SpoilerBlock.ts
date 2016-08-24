import { RevealableOutlineSyntaxNode } from './RevealableOutlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class SpoilerBlock extends RevealableOutlineSyntaxNode {
  write(writer: Renderer): string {
    return writer.spoilerBlock(this)
  }

  protected SPOILER_BLOCK(): void { }
}
