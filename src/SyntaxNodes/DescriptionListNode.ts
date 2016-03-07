import { SyntaxNode } from './SyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { DescriptionListItemNode } from './DescriptionListItemNode'

export class DescriptionListNode extends OutlineSyntaxNode {
  constructor(listItems: DescriptionListItemNode[]) {
    super()
  }
  
  private DESCRIPTION_LIST: any = null
}