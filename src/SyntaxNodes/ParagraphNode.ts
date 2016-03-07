import { SyntaxNode } from './SyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'

export class ParagraphNode extends OutlineSyntaxNode {
  constructor(public children: SyntaxNode[] = []) {
    super()
  }
  
  private PARAGRAPH: any = null
}