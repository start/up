import { OutlineSyntaxNode } from '../SyntaxNodes/OutlineSyntaxNode'
import { FootnoteBlockNode } from '../SyntaxNodes/FootnoteBlockNode'
import { Sequence } from '../Sequence'
import { handleOutlineNodeAndGetBlocklessFootnotes } from '../Parsing/handleFootnotes'


export class OutlineSyntaxNodeContainer {
  constructor(public children: OutlineSyntaxNode[]) { }

  insertFootnoteBlocksAndAssignFootnoteReferenceNumbers(referenceNumberSequence: Sequence): void {
    const outlineNodesWithFootnoteBlocks: OutlineSyntaxNode[] = []

    for (const outlineNode of this.children) {
      outlineNodesWithFootnoteBlocks.push(outlineNode)

      const footnotesForNextFootnoteBlock =
        handleOutlineNodeAndGetBlocklessFootnotes(outlineNode, referenceNumberSequence)

      if (footnotesForNextFootnoteBlock.length) {
        const footnoteBlock = new FootnoteBlockNode(footnotesForNextFootnoteBlock)
        footnoteBlock.processFootnotesAndGetThoseThatAreStillBlockless(referenceNumberSequence)
        outlineNodesWithFootnoteBlocks.push(footnoteBlock)
      }
    }

    this.children = outlineNodesWithFootnoteBlocks
  }
}