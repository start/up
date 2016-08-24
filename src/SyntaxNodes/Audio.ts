import { MediaSyntaxNode } from './MediaSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class Audio extends MediaSyntaxNode {
  write(writer: Renderer): string {
    return writer.audio(this)
  }

  protected AUDIO(): void { }
}
