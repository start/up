import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { FootnoteNode } from './FootnoteNode'
import { Sequence } from '../Sequence'


export class ParagraphNode extends InlineSyntaxNodeContainer implements OutlineSyntaxNode {
  processFootnotesAndGetThoseThatAreStillBlockless(referenceNumberSequence: Sequence): FootnoteNode[] {
    return this.getOutermostFootnotesAndAssignTheirReferenceNumbers(referenceNumberSequence)
  }

  OUTLINE_SYNTAX_NODE(): void { }
  protected PARAGRAPH_NODE(): void { }
}
