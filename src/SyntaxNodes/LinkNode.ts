import { InlineSyntaxNode } from './InlineSyntaxNode'

export class LinkNode extends InlineSyntaxNode {
  constructor(public children?: InlineSyntaxNode[], public url: string = '') {
    super()
  }
  
  private LINK: any = null
}