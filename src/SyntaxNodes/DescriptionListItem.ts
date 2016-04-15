import { Description } from './Description'
import { DescriptionTerm } from './DescriptionTerm'

export class DescriptionListItem {
  constructor(public terms: DescriptionTerm[], public description: Description) { }
  
  private DESCRIPTION_LIST_ITEM: any = null
}
