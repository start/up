import { MediaSyntaxNode } from './MediaSyntaxNode'
import { Writer } from '../Writing/Writer'


export class Audio extends MediaSyntaxNode {
  write(writer: Writer): string {
    return writer.audio(this)
  }

  protected AUDIO(): void { }
}
