import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'
import { FootnoteNode } from './FootnoteNode'
import { Sequence } from '../Sequence'
import { concat } from '../CollectionHelpers'
import { getTopLevelFootnotesFromInlineNodeContainersAndAssignTheirReferenceNumbers } from '../Parsing/handleFootnotes'


export class DescriptionListNode implements OutlineSyntaxNode {
  constructor(public items: DescriptionListNode.Item[]) { }

  processFootnotesAndGetThoseThatAreStillBlockless(referenceNumberSequence: Sequence): FootnoteNode[] {
    return concat(
      this.items.map(item => item.processFootnotesAndGetThoseThatAreStillBlockless(referenceNumberSequence)))
  }

  OUTLINE_SYNTAX_NODE(): void { }
}


export module DescriptionListNode {
  export class Item {
    constructor(
      public terms: DescriptionListNode.Item.Term[],
      public description: DescriptionListNode.Item.Description) { }

    processFootnotesAndGetThoseThatAreStillBlockless(referenceNumberSequence: Sequence): FootnoteNode[] {
      const footnotesFromTerms =
        getTopLevelFootnotesFromInlineNodeContainersAndAssignTheirReferenceNumbers(this.terms, referenceNumberSequence)

      const footnotesFromDescription =
        this.description.processFootnotesAndGetThoseThatAreStillBlockless(referenceNumberSequence)

      return footnotesFromTerms.concat(footnotesFromDescription)
    }
  }


  export module Item {
    export class Term extends InlineSyntaxNodeContainer {
      protected DESCRIPTION_LIST_ITEM_TERM(): void { }
    }

    export class Description extends OutlineSyntaxNodeContainer {
      protected DESCRIPTION_LIST_ITEM_DESCRIPTION(): void { }
    }
  }
}