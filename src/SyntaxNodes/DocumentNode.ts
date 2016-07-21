import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class DocumentNode {
  protected DOCUMENT: any = null
  
  constructor(public children: OutlineSyntaxNode[] = []) { }
}
