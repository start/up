import { InlineSyntaxNode } from './InlineSyntaxNode'

export class InlineAsideNode extends InlineSyntaxNode {
  constructor(public children: InlineSyntaxNode[] = []) {
    super()  
  }
  
  private INLINE_ASIDE: any = null
}