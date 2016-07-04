import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class DocumentNode {
  private DOCUMENT: any = null
  
  constructor(public children: OutlineSyntaxNode[] = []) { }
}
