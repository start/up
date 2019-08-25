import { Renderer } from '../Rendering/Renderer'
import { RichOutlineSyntaxNode } from './RichOutlineSyntaxNode'


export class Blockquote extends RichOutlineSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.blockquote(this)
  }

  protected BLOCKQUOTE(): void { }
}
