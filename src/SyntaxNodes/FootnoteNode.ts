import { InlineSyntaxNode } from './InlineSyntaxNode'
import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'


export class FootnoteNode extends RichInlineSyntaxNode {
  protected FOOTNOTE: any = null

  constructor(children: InlineSyntaxNode[], public referenceNumber?: number) {
    super(children)
  }
}
