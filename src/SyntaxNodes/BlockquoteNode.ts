import { RichOutlineSyntaxNode } from './RichOutlineSyntaxNode'
import { FootnoteNode } from './FootnoteNode'
import { Sequence } from '../Sequence'


export class BlockquoteNode extends RichOutlineSyntaxNode {
  processFootnotesAndGetThoseThatAreStillBlockless(referenceNumberSequence: Sequence): FootnoteNode[] {
    this.insertFootnoteBlocksAndAssignFootnoteReferenceNumbers(referenceNumberSequence)

    return []
  }

  protected BLOCKQUOTE_NODE(): void { }
}
