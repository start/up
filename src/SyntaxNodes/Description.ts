import { OutlineSyntaxNode } from './OutlineSyntaxNode'

export class Description {
  constructor(public children: OutlineSyntaxNode[]) { }
  
  private DESCRIPTION: any = null
}
