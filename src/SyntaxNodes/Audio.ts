import { MediaSyntaxNode } from './MediaSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class Audio extends MediaSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.audio(this)
  }

  protected AUDIO(): void { }
}
