import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'

export class LinkNode extends RichSyntaxNode {
  constructor(children?: SyntaxNode[], public url: string = '') {
    super(children)
  }
  
  private LINK: any = null
}