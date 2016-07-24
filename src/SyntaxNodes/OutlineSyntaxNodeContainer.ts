import { OutlineSyntaxNode } from '../SyntaxNodes/OutlineSyntaxNode'
import { FootnoteBlockNode } from '../SyntaxNodes/FootnoteBlockNode'
import { FootnoteNode } from '../SyntaxNodes/FootnoteNode'
import { Sequence } from '../Sequence'
import { concat } from '../CollectionHelpers'


export class OutlineSyntaxNodeContainer {
  constructor(public children: OutlineSyntaxNode[]) { }

  // For more information about our footnote handling process, see the enormous explanation in DocumentNode.ts.

  processFootnotesAndGetThoseThatAreStillBlockless(referenceNumberSequence: Sequence): FootnoteNode[] {
    return concat(
      this.children.map(child => child.processFootnotesAndGetThoseThatAreStillBlockless(referenceNumberSequence)))
  }

  giveFootnotesReferenceNumbersAndPutThemInBlocks(referenceNumberSequence: Sequence): void {
    const outlineNodesWithFootnoteBlocks: OutlineSyntaxNode[] = []

    for (const child of this.children) {
      outlineNodesWithFootnoteBlocks.push(child)

      const footnotesForNextFootnoteBlock =
        child.processFootnotesAndGetThoseThatAreStillBlockless(referenceNumberSequence)

      if (footnotesForNextFootnoteBlock.length) {
        const footnoteBlock = new FootnoteBlockNode(footnotesForNextFootnoteBlock)
        footnoteBlock.processFootnotesAndGetThoseThatAreStillBlockless(referenceNumberSequence)
        outlineNodesWithFootnoteBlocks.push(footnoteBlock)
      }
    }

    this.children = outlineNodesWithFootnoteBlocks
  }
}