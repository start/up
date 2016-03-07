import { InlineSyntaxNode } from './InlineSyntaxNode'

export class SpoilerNode extends InlineSyntaxNode {
  constructor(public children: InlineSyntaxNode[] = []) {
    super()  
  }
  
  private SPOILER: any = null
}