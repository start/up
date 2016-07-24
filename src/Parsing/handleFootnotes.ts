import { concat } from '../CollectionHelpers'
import { Sequence } from'../Sequence'
import { InlineSyntaxNodeContainer } from '../SyntaxNodes/InlineSyntaxNodeContainer'
import { FootnoteNode } from '../SyntaxNodes/FootnoteNode'
import { InlineSyntaxNode } from '../SyntaxNodes/InlineSyntaxNode'
import { RichInlineSyntaxNode } from '../SyntaxNodes/RichInlineSyntaxNode'


// Here, "outermost footnote" refers to any footnote that isn't nested within another footnote. It does not
// exclude footntoes nested within other inline conventions (e.g. emphasis or stress).
//
// The reference numbers of nested footnotes aren't assigned until we produce their containing footnote blocks.
export function getOutermostFootnotesAndAssignTheirReferenceNumbers(nodes: InlineSyntaxNode[], referenceNumberSequence: Sequence): FootnoteNode[] {
  const footnotes: FootnoteNode[] = []

  for (const node of nodes) {
    if (node instanceof FootnoteNode) {
      node.referenceNumber = referenceNumberSequence.next()
      footnotes.push(node)
      continue
    }

    if (node instanceof RichInlineSyntaxNode) {
      footnotes.push(
        ...getOutermostFootnotesAndAssignTheirReferenceNumbers(node.children, referenceNumberSequence))
    }
  }

  return footnotes
}

export function getTopLevelFootnotesFromInlineNodeContainersAndAssignTheirReferenceNumbers(containers: InlineSyntaxNodeContainer[], referenceNumberSequence: Sequence): FootnoteNode[] {
  return concat(
    containers.map(container => getOutermostFootnotesAndAssignTheirReferenceNumbers(container.children, referenceNumberSequence)))
}