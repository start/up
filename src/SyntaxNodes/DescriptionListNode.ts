import { SyntaxNode } from './SyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { DescriptionListItem } from './DescriptionListItem'

export class DescriptionListNode extends OutlineSyntaxNode {
  constructor(listItems: DescriptionListItem[]) {
    super()
  }
  
  private DESCRIPTION_LIST: any = null
}