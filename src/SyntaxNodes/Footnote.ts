import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'

export class Footnote {
  constructor(public children: InlineSyntaxNode[] = [], referenceNumber: number) { }
  
  private FOOTNOTE: any = null
}
