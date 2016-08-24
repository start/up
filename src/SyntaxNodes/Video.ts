import { MediaSyntaxNode } from './MediaSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class Video extends MediaSyntaxNode {
  write(writer: Renderer): string {
    return writer.video(this)
  }

  protected VIDEO(): void { }
}
