import { Renderer } from '../Rendering/Renderer'
import { MediaSyntaxNode } from './MediaSyntaxNode'


export class Video extends MediaSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.video(this)
  }

  protected readonly VIDEO = undefined
}
