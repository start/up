import { RichOutlineSyntaxNode } from './RichOutlineSyntaxNode'
import { FootnoteNode } from './FootnoteNode'
import { Sequence } from '../Sequence'


export class NsfwBlockNode extends RichOutlineSyntaxNode {
  processFootnotesAndGetThoseThatAreStillBlockless(referenceNumberSequence: Sequence): FootnoteNode[] {
    this.insertFootnoteBlocksAndAssignFootnoteReferenceNumbers(referenceNumberSequence)

    return []
  }
  
  protected NSFW_BLOCK_NODE(): void { }
}
