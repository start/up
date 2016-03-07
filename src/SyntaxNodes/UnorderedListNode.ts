import { UnorderedListItemNode } from './UnorderedListItemNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'

export class UnorderedListNode extends RichSyntaxNode {
  constructor(public children: UnorderedListItemNode[] = []) {
    super()
  }
  
  private UNORDERED_LIST: any = null
}