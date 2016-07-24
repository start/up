import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'
import { FootnoteNode } from './FootnoteNode'
import { Sequence } from '../Sequence'
import { handleOutlineNodeContainersAndGetBlocklessFootnotes } from '../Parsing/handleFootnotes'


export class UnorderedListNode implements OutlineSyntaxNode {
  constructor(public items: UnorderedListNode.Item[]) { }

  processFootnotesAndGetThoseThatAreStillBlockless(referenceNumberSequence: Sequence): FootnoteNode[] {
    return handleOutlineNodeContainersAndGetBlocklessFootnotes(this.items, referenceNumberSequence)
  }
  
  OUTLINE_SYNTAX_NODE(): void { }
}


export module UnorderedListNode {
  export class Item extends OutlineSyntaxNodeContainer {
    protected UNORDERED_LIST_ITEM(): void { }
  }
}