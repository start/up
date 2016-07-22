import { Description } from './Description'
import { DescriptionTerm } from './DescriptionTerm'

export class DescriptionListNode {
  OUTLINE_SYNTAX_NODE(): void { }
  protected DESCRIPTION_LIST: any = null

  constructor(public listItems: DescriptionListNode.Item[]) { }
}


export module DescriptionListNode {
  export class Item {
    protected DESCRIPTION_LIST_ITEM: any = null

    constructor(public terms: DescriptionTerm[], public description: Description) { }
  }
}