import { InlineSyntaxNode } from './InlineSyntaxNode'

export class StressNode extends InlineSyntaxNode {
  constructor(children: InlineSyntaxNode[] = []) {
    super()  
  }
  
  STRESS: any = null
}