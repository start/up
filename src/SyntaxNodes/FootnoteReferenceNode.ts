import { InlineSyntaxNode } from './InlineSyntaxNode'
import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'

export class FootnoteReferenceNode extends RichInlineSyntaxNode {
  constructor(children: InlineSyntaxNode[], public referenceNumber?: number) {
    super(children)
  }
  
  private FOOTNOTE_REFERENCE: any = null
}
