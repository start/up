import { InlineSyntaxNode } from './InlineSyntaxNode'

export class InlineAsideNode extends InlineSyntaxNode {
  constructor(children: InlineSyntaxNode[] = []) {
    super()  
  }
  
  private INLINE_ASIDE: any = null
}