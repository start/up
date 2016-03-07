import { InlineSyntaxNode } from './InlineSyntaxNode'

export class StressNode extends InlineSyntaxNode {
  constructor(public children: InlineSyntaxNode[] = []) {
    super()  
  }
  
  STRESS: any = null
}