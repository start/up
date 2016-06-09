import { InlineSyntaxNode } from './InlineSyntaxNode'


export class Line {
  constructor(public children: InlineSyntaxNode[]) { }
  
  private LINE: any = null
}
