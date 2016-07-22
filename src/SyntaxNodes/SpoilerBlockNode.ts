import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class SpoilerBlockNode {
  OUTLINE_SYNTAX_NODE(): void { }

  constructor(public children: OutlineSyntaxNode[] = []) { }

  protected SPOILER_BLOCK_NODE(): void { }
}
