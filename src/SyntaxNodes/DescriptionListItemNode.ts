import { Description } from './DescriptionNode'
import { DescriptionTerm } from './DescriptionTermNode'

export class DescriptionListItem {
  constructor(public terms: DescriptionTerm[], public description: Description) { }
  
  private DESCRIPTION_LIST_ITEM: any = null
}