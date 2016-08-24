import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class RevisionInsertion extends RichInlineSyntaxNode {
  write(writer: Renderer): string {
    return writer.revisionInsertion(this)
  }

  protected REVISION_INSERTION(): void { }
}
