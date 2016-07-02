import { UnorderedListItem } from './UnorderedListItem'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class UnorderedListNode extends OutlineSyntaxNode {
  constructor(public listItems: UnorderedListItem[] = []) {
    super()
  }

  private UNORDERED_LIST: any = null
}
