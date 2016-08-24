import { RevealableOutlineSyntaxNode } from './RevealableOutlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class NsflBlock extends RevealableOutlineSyntaxNode {
  write(writer: Renderer): string {
    return writer.nsflBlock(this)
  }

  protected NSFL_BLOCK(): void { }
}
