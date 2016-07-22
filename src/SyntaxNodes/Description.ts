import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class Description {
  constructor(public children: OutlineSyntaxNode[]) { }
  
  protected DESCRIPTION: any = null
}
