import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { FootnoteNode } from './FootnoteNode'
import { Sequence } from '../Sequence'
import { concat } from '../CollectionHelpers'
import { getOutermostFootnotesAndAssignTheirReferenceNumbers } from './getOutermostFootnotesAndAssignTheirReferenceNumbers'


export class LineBlockNode implements OutlineSyntaxNode {
  constructor(public lines: LineBlockNode.Line[]) { }

  processFootnotesAndGetThoseThatAreStillBlockless(referenceNumberSequence: Sequence): FootnoteNode[] {
    return concat(
      this.lines.map(line => getOutermostFootnotesAndAssignTheirReferenceNumbers(line, referenceNumberSequence)))
  }

  OUTLINE_SYNTAX_NODE(): void { }
}


export module LineBlockNode {
  export class Line extends InlineSyntaxNodeContainer {
    protected LINE_BLOCK_LINE(): void { }
  }
}