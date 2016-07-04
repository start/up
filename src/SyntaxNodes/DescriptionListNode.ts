import { DescriptionListItem } from './DescriptionListItem'


export class DescriptionListNode {
  OUTLINE_SYNTAX_NODE(): void { }
  
  constructor(public listItems: DescriptionListItem[]) { }

  private DESCRIPTION_LIST: any = null
}
