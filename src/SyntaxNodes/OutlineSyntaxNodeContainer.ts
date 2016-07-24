import { OutlineSyntaxNode } from '../SyntaxNodes/OutlineSyntaxNode'
import { FootnoteBlockNode } from '../SyntaxNodes/FootnoteBlockNode'
import { Sequence } from '../Sequence'


export class OutlineSyntaxNodeContainer {
  constructor(public children: OutlineSyntaxNode[]) { }

  processFootnotesAndPutThemInBlocks(referenceNumberSequence: Sequence): void {
    const outlineNodesWithFootnoteBlocks: OutlineSyntaxNode[] = []

    for (const outlineNode of this.children) {
      outlineNodesWithFootnoteBlocks.push(outlineNode)

      const footnotesForNextFootnoteBlock =
        outlineNode.processFootnotesAndGetThoseThatAreStillBlockless(referenceNumberSequence)

      if (footnotesForNextFootnoteBlock.length) {
        const footnoteBlock = new FootnoteBlockNode(footnotesForNextFootnoteBlock)
        footnoteBlock.processFootnotesAndGetThoseThatAreStillBlockless(referenceNumberSequence)
        outlineNodesWithFootnoteBlocks.push(footnoteBlock)
      }
    }

    this.children = outlineNodesWithFootnoteBlocks
  }
}