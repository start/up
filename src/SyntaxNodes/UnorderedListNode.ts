import { UnorderedListItemNode } from './UnorderedListItemNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'

export class UnorderedListNode extends OutlineSyntaxNode {
  constructor(public listItems: UnorderedListItemNode[] = []) {
    super()
  }
  
  private UNORDERED_LIST: any = null
}