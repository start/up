import { MediaSyntaxNode } from './MediaSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class Image extends MediaSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.image(this)
  }

  protected IMAGE(): void { }
}
