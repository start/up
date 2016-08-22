import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { Writer } from '../Writing/Writer'


export class RevisionDeletion extends RichInlineSyntaxNode {
  write(writer: Writer): string {
    return writer.revisionDeletion(this)
  }

  protected REVISION_DELETION(): void { }
}
