import { RichOutlineSyntaxNode } from './RichOutlineSyntaxNode'
import { FootnoteNode } from './FootnoteNode'
import { Sequence } from '../Sequence'


export class SpoilerBlockNode extends RichOutlineSyntaxNode {
  processFootnotesAndGetThoseThatAreStillBlockless(referenceNumberSequence: Sequence): FootnoteNode[] {
    this.processFootnotesAndPutThemInBlocks(referenceNumberSequence)

    return []
  }

  protected SPOILER_BLOCK_NODE(): void { }
}
