import { RichOutlineSyntaxNode } from './RichOutlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class Blockquote extends RichOutlineSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.blockquote(this)
  }

  protected BLOCKQUOTE(): void { }
}
