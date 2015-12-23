import { SyntaxNode } from './SyntaxNode'

export class LinkNode extends SyntaxNode {
  constructor(children: SyntaxNode[], public url: string) {
    super(children)
  }
  
  LINK_NODE: any = null
}