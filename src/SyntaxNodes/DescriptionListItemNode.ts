import { DescriptionNode } from './DescriptionNode'
import { DescriptionTermNode } from './DescriptionTermNode'

export class DescriptionListItemNode {
  constructor(public terms: DescriptionTermNode[], public description: DescriptionNode) { }
  
  private DESCRIPTION_LIST_ITEM: any = null
}