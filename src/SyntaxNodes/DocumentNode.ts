import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class DocumentNode {
  constructor(public children: OutlineSyntaxNode[] = []) { }
  
  protected DOCUMENT_NODE(): void { }
}
