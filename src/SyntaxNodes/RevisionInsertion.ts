import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { Renderer } from '../Rendering/Renderer'


export class RevisionInsertion extends RichInlineSyntaxNode {
  render(renderer: Renderer): string {
    return renderer.revisionInsertion(this)
  }

  protected REVISION_INSERTION(): void { }
}
