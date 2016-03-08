import { SyntaxNode } from './SyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { DescriptionListItem } from './DescriptionListItemNode'

export class DescriptionListNode extends OutlineSyntaxNode {
  constructor(public listItems: DescriptionListItem[]) {
    super()
  }
  
  private DESCRIPTION_LIST: any = null
}