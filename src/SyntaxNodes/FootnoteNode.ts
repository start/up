import { InlineSyntaxNode } from './InlineSyntaxNode'
import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'

export class FootnoteNode extends RichInlineSyntaxNode {
  constructor(children: InlineSyntaxNode[], public referenceNumber?: number) {
    super(children)
  }
  
  private FOOTNOTE: any = null
}
