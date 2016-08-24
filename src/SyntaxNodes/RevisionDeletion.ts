import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class RevisionDeletion extends RichInlineSyntaxNode {
  write(writer: Renderer): string {
    return writer.revisionDeletion(this)
  }

  protected REVISION_DELETION(): void { }
}
