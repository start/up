import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'

export class FootnoteNode extends OutlineSyntaxNode {
  constructor(public children: InlineSyntaxNode[] = [], referenceNumber: number) {
    super()
  }
  
  private FOOTNOTE: any = null
}
