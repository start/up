import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'

export class HeadingNode extends OutlineSyntaxNode {
  constructor(public children?: SyntaxNode[], public level?: number) {
    super()
  }
  
  private HEADING: any = null
}