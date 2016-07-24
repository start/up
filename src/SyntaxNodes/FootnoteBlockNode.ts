import { FootnoteNode } from './FootnoteNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { Sequence } from '../Sequence'
import { getOutermostFootnotesAndAssignTheirReferenceNumbers } from '../Parsing/handleFootnotes'

export class FootnoteBlockNode implements OutlineSyntaxNode {
  constructor(public footnotes: FootnoteNode[]) { }

  processFootnotesAndGetThoseThatAreStillBlockless(referenceNumberSequence: Sequence): FootnoteNode[] {
    for (let i = 0; i < this.footnotes.length; i++) {
      const footnote = this.footnotes[i]

      const nestedFootnotes =
        getOutermostFootnotesAndAssignTheirReferenceNumbers(footnote.children, referenceNumberSequence)

      // Note: This appends items to the collection we're currently looping through.
      this.footnotes.push(...nestedFootnotes)
    }

    // No footnotes in this footnote block are blockless!
    return []
  }

  OUTLINE_SYNTAX_NODE(): void { }
  protected FOOTNOTE_BLOCK_NODE(): void { }
}
