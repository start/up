import { InlineSyntaxNode } from './InlineSyntaxNode'

export class FootnoteReferenceNode extends InlineSyntaxNode {
  constructor(public referenceOrdinal: number) {
    super()
  }
  
  private FOOTNOTE_REFERENCE: any = null
}
