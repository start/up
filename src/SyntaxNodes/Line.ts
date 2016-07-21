import { InlineSyntaxNode } from './InlineSyntaxNode'


export class Line {
  protected LINE: any = null

  constructor(public children: InlineSyntaxNode[]) { }
}
