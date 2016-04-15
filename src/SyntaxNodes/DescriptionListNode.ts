import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { DescriptionListItem } from './DescriptionListItem'

export class DescriptionListNode extends OutlineSyntaxNode {
  constructor(public listItems: DescriptionListItem[]) {
    super()
  }
  
  private DESCRIPTION_LIST: any = null
}
