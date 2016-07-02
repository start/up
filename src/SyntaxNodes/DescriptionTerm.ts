import { InlineSyntaxNode } from './InlineSyntaxNode'


export class DescriptionTerm {
  constructor(public children: InlineSyntaxNode[]) { }

  private DESCRIPTION_TERM: any = null
}
