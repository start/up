import { OutlineSyntaxNode } from './OutlineSyntaxNode'

export class DocumentNode {
  constructor(public children: OutlineSyntaxNode[] = []) { }
  
  private DOCUMENT: any = null
}
