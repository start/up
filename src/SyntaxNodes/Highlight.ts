import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class Highlight extends RichInlineSyntaxNode {
  write(writer: Renderer): string {
    return writer.highlight(this)
  }

  protected HIGHLIGHT(): void { }
}
