import { UnorderedListItem } from './UnorderedListItem'


export class UnorderedListNode {
  OUTLINE_SYNTAX_NODE(): void { }
  private UNORDERED_LIST: any = null

  constructor(public listItems: UnorderedListItem[] = []) { }
}
