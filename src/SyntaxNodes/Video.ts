import { MediaSyntaxNode } from './MediaSyntaxNode'
import { Writer } from '../Writing/Writer'


export class Video extends MediaSyntaxNode {
  write(writer: Writer): string {
    return writer.video(this)
  }

  protected VIDEO(): void { }
}
