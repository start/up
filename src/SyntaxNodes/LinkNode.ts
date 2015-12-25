import { SyntaxNode } from './SyntaxNode'

export class LinkNode extends SyntaxNode {
  constructor(children: SyntaxNode[], public url: string) {
    super(children)
  }
  
  valid(): boolean {
    return !!this.url; 
  }
  
  private LINK_NODE: any = null
}