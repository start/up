import { InlineSyntaxNode } from './InlineSyntaxNode'
import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'

export class FootnoteReferenceNode extends RichInlineSyntaxNode {
  public referenceNumber: number
  
  constructor(referenceNumberOrChildren: number | InlineSyntaxNode[]) {
    super([])
    
    if (typeof referenceNumberOrChildren === "number") {
      this.referenceNumber = referenceNumberOrChildren
    } else {
      this.children = referenceNumberOrChildren
    }
  }
  
  private FOOTNOTE_REFERENCE: any = null
}
