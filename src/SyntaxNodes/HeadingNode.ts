import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'

export class HeadingNode extends RichSyntaxNode {
  constructor(parentOrChildren?: RichSyntaxNode|SyntaxNode[], public level?: number) {
    super(parentOrChildren)
  }
  
  private HEADING: any = null
}