import { RichOutlineSyntaxNode } from './RichOutlineSyntaxNode'
import { FootnoteNode } from './FootnoteNode'
import { Sequence } from '../Sequence'


export class NsflBlockNode extends RichOutlineSyntaxNode {
  processFootnotesAndGetThoseThatAreStillBlockless(referenceNumberSequence: Sequence): FootnoteNode[] {
    this.processFootnotesAndPutThemInBlocks(referenceNumberSequence)

    return []
  }

  protected NSFL_BLOCK_NODE(): void { }
}
