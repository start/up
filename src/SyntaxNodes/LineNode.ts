import { InlineSyntaxNode } from './InlineSyntaxNode'
import { SyntaxNode } from './SyntaxNode'

export class LineNode extends SyntaxNode {
  constructor(public children: InlineSyntaxNode[]) {
    super()
  }
  
  private LINE: any = null
}