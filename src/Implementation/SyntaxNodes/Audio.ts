import { Renderer } from '../Rendering/Renderer'
import { MediaSyntaxNode } from './MediaSyntaxNode'


export class Audio extends MediaSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.audio(this)
  }

  protected AUDIO(): void { }
}
