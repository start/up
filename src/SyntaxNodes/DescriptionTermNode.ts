import { SyntaxNode } from './SyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'

export class DescriptionTermNode extends SyntaxNode {
  constructor(children: InlineSyntaxNode[]) {
    super()
  }
  
  private DESCRIPTION_TERM: any = null
}