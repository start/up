import { InlineSyntaxNode } from './InlineSyntaxNode'

export class Footnote {
  constructor(public children: InlineSyntaxNode[] = [], public referenceNumber: number) { }
  
  private FOOTNOTE: any = null
}
