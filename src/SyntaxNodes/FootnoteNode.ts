import { InlineSyntaxNode } from './InlineSyntaxNode'
import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'


export class FootnoteNode extends RichInlineSyntaxNode {
  private FOOTNOTE: any = null

  constructor(children: InlineSyntaxNode[], public referenceNumber?: number) {
    super(children)
  }
}
