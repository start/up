import { InlineSyntaxNode } from './InlineSyntaxNode'

export class DescriptionTermNode {
  constructor(public children: InlineSyntaxNode[]) { }
  
  private DESCRIPTION_TERM: any = null
}