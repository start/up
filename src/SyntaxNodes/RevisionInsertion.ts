import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { Writer } from '../Writing/Writer'


export class RevisionInsertion extends RichInlineSyntaxNode {
  write(writer: Writer): string {
    return writer.revisionInsertion(this)
  }

  protected REVISION_INSERTION(): void { }
}
