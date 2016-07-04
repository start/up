import { UnorderedListItem } from './UnorderedListItem'


export class UnorderedListNode {
  OUTLINE_SYNTAX_NODE(): void { }
  
  constructor(public listItems: UnorderedListItem[] = []) { }

  private UNORDERED_LIST: any = null
}
