import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { FootnoteNode } from '../SyntaxNodes/FootnoteNode'
import { Sequence } from'../Sequence'


// Here, "outermost footnote" refers to any footnote that isn't nested within another footnote. It does not
// exclude footntoes nested within other inline conventions (e.g. emphasis or stress).
//
// The reference numbers of nested footnotes aren't assigned until we produce their containing footnote blocks.
//
// For more information about our footnote handling process, see the enormous explanation in DocumentNode.ts.
export function getOutermostFootnotesAndAssignTheirReferenceNumbers(container: InlineSyntaxNodeContainer, referenceNumberSequence: Sequence): FootnoteNode[] {
  const footnotes: FootnoteNode[] = []

  for (const node of container.children) {
    if (node instanceof FootnoteNode) {
      node.referenceNumber = referenceNumberSequence.next()
      footnotes.push(node)
      continue
    }

    if (node instanceof InlineSyntaxNodeContainer) {
      footnotes.push(
        ...getOutermostFootnotesAndAssignTheirReferenceNumbers(node, referenceNumberSequence))
    }
  }

  return footnotes
}