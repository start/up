import { InlineSyntaxNode } from './InlineSyntaxNode'
import { FootnoteNode } from '../SyntaxNodes/FootnoteNode'
import { Sequence } from'../Sequence'


export class InlineSyntaxNodeContainer {
  constructor(public children: InlineSyntaxNode[]) { }

  // Here, "outermost footnote" refers to any footnote that isn't nested within another footnote. It does not
  // exclude footntoes nested within other inline conventions (e.g. emphasis or stress).
  //
  // The reference numbers of nested footnotes aren't assigned until we produce their containing footnote blocks.
  getOutermostFootnotesAndAssignTheirReferenceNumbers(referenceNumberSequence: Sequence): FootnoteNode[] {
    const footnotes: FootnoteNode[] = []

    for (const node of this.children) {
      if (node instanceof FootnoteNode) {
        node.referenceNumber = referenceNumberSequence.next()
        footnotes.push(node)
        continue
      }

      if (node instanceof InlineSyntaxNodeContainer) {
        footnotes.push(
          ...this.getOutermostFootnotesAndAssignTheirReferenceNumbers(referenceNumberSequence))
      }
    }

    return footnotes
  }
}