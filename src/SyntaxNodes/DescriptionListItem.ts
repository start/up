import { Description } from './Description'
import { DescriptionTerm } from './DescriptionTerm'


export class DescriptionListItem {
  protected DESCRIPTION_LIST_ITEM: any = null
  
  constructor(public terms: DescriptionTerm[], public description: Description) { }
}
