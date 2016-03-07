import { LineNode } from './LineNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'

export class LineBlockNode extends OutlineSyntaxNode {
  constructor(public children: LineNode[] = []) {
    super()
  }
  
  private LINE_BLOCK: any = null
}