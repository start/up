import { InlineSyntaxNode } from './InlineSyntaxNode'

export class EmphasisNode extends InlineSyntaxNode {
  constructor(children: InlineSyntaxNode[] = []) {
    super()  
  }
  
  private EMPHASIS: any = null
}