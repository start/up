import { Line } from './Line'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class LineBlockNode extends OutlineSyntaxNode {
  constructor(public lines: Line[] = []) {
    super()
  }

  private LINE_BLOCK: any = null
}
