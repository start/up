import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class SpoilerBlockNode {
  OUTLINE_SYNTAX_NODE(): void { }
  protected SPOILER_BLOCK: any = null
  
  constructor(public children: OutlineSyntaxNode[] = []) { }
}
