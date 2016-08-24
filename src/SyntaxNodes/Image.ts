import { MediaSyntaxNode } from './MediaSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class Image extends MediaSyntaxNode {
  write(writer: Renderer): string {
    return writer.image(this)
  }

  protected IMAGE(): void { }
}
