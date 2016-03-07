import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'

export class LinkNode extends RichInlineSyntaxNode {
  constructor(public children?: InlineSyntaxNode[], public url: string = '') {
    super(children)
  }
  
  private LINK: any = null
}