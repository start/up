import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'
import { FootnoteNode } from './FootnoteNode'
import { Sequence } from '../Sequence'
import { getTopLevelFootnotesFromInlineNodeContainersAndAssignTheirReferenceNumbers, handleOutlineNodesAndGetBlocklessFootnotes } from '../Parsing/handleFootnotes'

export class DescriptionListNode implements OutlineSyntaxNode {
  constructor(public items: DescriptionListNode.Item[]) { }

  OUTLINE_SYNTAX_NODE(): void { }
}


export module DescriptionListNode {
  export class Item {
    constructor(
      public terms: DescriptionListNode.Item.Term[],
      public description: DescriptionListNode.Item.Description) { }



 getBlocklessFootnotes(referenceNumberSequence: Sequence): FootnoteNode[] {
  const footnotesFromTerms =
    getTopLevelFootnotesFromInlineNodeContainersAndAssignTheirReferenceNumbers(this.terms, referenceNumberSequence)

  const footnotesFromDescription =
    handleOutlineNodesAndGetBlocklessFootnotes(this.description.children, referenceNumberSequence)

  return footnotesFromTerms.concat(footnotesFromDescription)
}
  }


  export module Item {
    export class Term extends InlineSyntaxNodeContainer {
      protected DESCRIPTION_LIST_ITEM_TERM(): void { }
    }

    export class Description implements OutlineSyntaxNodeContainer {
      constructor(public children: OutlineSyntaxNode[]) { }

      protected DESCRIPTION_LIST_ITEM_DESCRIPTION(): void { }
    }
  }
}