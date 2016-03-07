import { InlineSyntaxNode } from './InlineSyntaxNode'

export class RevisionInsertionNode extends InlineSyntaxNode {
  constructor(children: InlineSyntaxNode[] = []) {
    super()  
  }
  
  private REVISION_INSERTION: any = null
}