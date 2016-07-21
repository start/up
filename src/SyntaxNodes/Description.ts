import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class Description {
  protected DESCRIPTION: any = null
  
  constructor(public children: OutlineSyntaxNode[]) { }
}
