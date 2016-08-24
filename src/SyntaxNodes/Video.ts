import { MediaSyntaxNode } from './MediaSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class Video extends MediaSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.video(this)
  }

  protected VIDEO(): void { }
}
