import { RevealableOutlineSyntaxNode } from './RevealableOutlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class NsflBlock extends RevealableOutlineSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.nsflBlock(this)
  }

  protected NSFL_BLOCK(): void { }
}
