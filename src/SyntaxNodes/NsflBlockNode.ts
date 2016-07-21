import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class NsflBlockNode {
  OUTLINE_SYNTAX_NODE(): void { }
  protected NSFL_BLOCK: any = null
  
  constructor(public children: OutlineSyntaxNode[] = []) { }
}
