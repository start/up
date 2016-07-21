import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class NsfwBlockNode {
  OUTLINE_SYNTAX_NODE(): void { }
  protected NSFW_BLOCK: any = null
  
  constructor(public children: OutlineSyntaxNode[] = []) { }
}
