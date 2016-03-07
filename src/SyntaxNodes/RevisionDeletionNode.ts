import { InlineSyntaxNode } from './InlineSyntaxNode'

export class RevisionDeletionNode extends InlineSyntaxNode {
  constructor(children: InlineSyntaxNode[] = []) {
    super()  
  }
  
  private REVISION_DELETION: any = null
}