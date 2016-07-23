import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class CodeBlockNode implements OutlineSyntaxNode {
  constructor(public text: string) { }

  OUTLINE_SYNTAX_NODE(): void { }
  protected CODE_BLOCK_NODE(): void { }
}
