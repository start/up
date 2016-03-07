import { SyntaxNode } from './SyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { DescriptionNode } from './DescriptionNode'
import { DescriptionTermNode } from './DescriptionTermNode'

export class DescriptionListItemNode extends SyntaxNode {
  constructor(terms: DescriptionTermNode[], description: DescriptionTermNode) {
    super()
  }
  
  private DESCRIPTION_LIST_ITEM: any = null
}