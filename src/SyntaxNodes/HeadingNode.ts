import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { FootnoteNode } from './FootnoteNode'
import { Sequence } from '../Sequence'
import { getOutermostFootnotesAndAssignTheirReferenceNumbers } from '../Parsing/handleFootnotes'


export class HeadingNode extends InlineSyntaxNodeContainer implements OutlineSyntaxNode {
  constructor(public children: InlineSyntaxNode[], public level: number) {
    super(children)
  }

  processFootnotesAndGetThoseThatAreStillBlockless(referenceNumberSequence: Sequence): FootnoteNode[] {
    return getOutermostFootnotesAndAssignTheirReferenceNumbers(this.children, referenceNumberSequence)
  }

  OUTLINE_SYNTAX_NODE(): void { }
}
