import { Renderer } from '../Rendering/Renderer'
import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'


export class Highlight extends RichInlineSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.highlight(this)
  }

  protected readonly HIGHLIGHT = undefined
}
