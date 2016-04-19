import { InlineSyntaxNode } from './InlineSyntaxNode'

export class FootnoteReferenceNode extends InlineSyntaxNode {
  constructor(public referenceNumber: number) {
    super()
  }
  
  private FOOTNOTE_REFERENCE: any = null
}
