import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'

export class HeadingNode extends RichSyntaxNode {
  constructor(children?: SyntaxNode[], public level?: number) {
    super(children)
  }
  
  private HEADING: any = null
}