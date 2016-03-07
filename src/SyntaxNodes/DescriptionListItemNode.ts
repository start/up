import { SyntaxNode } from './SyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { DescriptionNode } from './DescriptionNode'
import { DescriptionTermNode } from './DescriptionTermNode'

export class DescriptionListItemNode extends SyntaxNode {
  constructor(public terms: DescriptionTermNode[], public description: DescriptionNode) {
    super()
  }
  
  private DESCRIPTION_LIST_ITEM: any = null
}