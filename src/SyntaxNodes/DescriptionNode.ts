import { OutlineSyntaxNode } from './OutlineSyntaxNode'

export class DescriptionNode {
  constructor(public children: OutlineSyntaxNode[]) { }
  
  private DESCRIPTION: any = null
}