import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class SpoilerBlockNode {
  OUTLINE_SYNTAX_NODE(): void { }
  private SPOILER_BLOCK: any = null
  
  constructor(public children: OutlineSyntaxNode[] = []) { }
}
