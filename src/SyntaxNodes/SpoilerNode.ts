import { InlineSyntaxNode } from './InlineSyntaxNode'

export class SpoilerNode extends InlineSyntaxNode {
  constructor(children: InlineSyntaxNode[] = []) {
    super()  
  }
  
  private SPOILER: any = null
}