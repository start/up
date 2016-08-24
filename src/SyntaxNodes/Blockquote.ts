import { RichOutlineSyntaxNode } from './RichOutlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class Blockquote extends RichOutlineSyntaxNode {
  write(writer: Renderer): string {
    return writer.blockquote(this)
  }

  protected BLOCKQUOTE(): void { }
}
