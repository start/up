import { InlineSyntaxNode } from './InlineSyntaxNode'

export class RevisionDeletionNode extends InlineSyntaxNode {
  constructor(public children: InlineSyntaxNode[] = []) {
    super()  
  }
  
  private REVISION_DELETION: any = null
}