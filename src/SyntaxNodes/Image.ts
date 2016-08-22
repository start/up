import { MediaSyntaxNode } from './MediaSyntaxNode'
import { Writer } from '../Writing/Writer'


export class Image extends MediaSyntaxNode {
  write(writer: Writer): string {
    return writer.image(this)
  }

  protected IMAGE(): void { }
}
