import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class Highlight extends RichInlineSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.highlight(this)
  }

  protected HIGHLIGHT(): void { }
}
