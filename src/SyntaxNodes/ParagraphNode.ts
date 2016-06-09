import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'


export class ParagraphNode extends OutlineSyntaxNode {
  constructor(public children: InlineSyntaxNode[] = []) {
    super()
  }
  
  private PARAGRAPH: any = null
}
