import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'


export class HeadingNode extends OutlineSyntaxNode {
  constructor(public children?: InlineSyntaxNode[], public level?: number) {
    super()
  }
  
  private HEADING: any = null
}
