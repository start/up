import { DescriptionListItem } from './DescriptionListItem'


export class DescriptionListNode {
  OUTLINE_SYNTAX_NODE(): void { }
  protected DESCRIPTION_LIST: any = null
  
  constructor(public listItems: DescriptionListItem[]) { }
}
