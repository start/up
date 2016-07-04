import { DescriptionListItem } from './DescriptionListItem'


export class DescriptionListNode {
  OUTLINE_SYNTAX_NODE(): void { }
  private DESCRIPTION_LIST: any = null
  
  constructor(public listItems: DescriptionListItem[]) { }
}
