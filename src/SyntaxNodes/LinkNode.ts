import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'

export class LinkNode extends RichSyntaxNode {
  constructor(parentOrChildren?: RichSyntaxNode|SyntaxNode[], public url: string = '') {
    super(parentOrChildren)
  }
  
  private LINK: any = null
}