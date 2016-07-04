import { Description } from './Description'
import { DescriptionTerm } from './DescriptionTerm'


export class DescriptionListItem {
  private DESCRIPTION_LIST_ITEM: any = null
  
  constructor(public terms: DescriptionTerm[], public description: Description) { }
}
