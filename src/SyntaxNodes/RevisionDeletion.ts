import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class RevisionDeletion extends RichInlineSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.revisionDeletion(this)
  }

  protected REVISION_DELETION(): void { }
}
