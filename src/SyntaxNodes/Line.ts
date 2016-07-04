import { InlineSyntaxNode } from './InlineSyntaxNode'


export class Line {
  private LINE: any = null

  constructor(public children: InlineSyntaxNode[]) { }
}
