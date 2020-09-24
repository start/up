import { Renderer } from '../Rendering/Renderer'
import { MediaSyntaxNode } from './MediaSyntaxNode'


export class Image extends MediaSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.image(this)
  }

  protected readonly IMAGE = undefined
}
