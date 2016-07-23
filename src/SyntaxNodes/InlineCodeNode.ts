import { InlineSyntaxNode } from './InlineSyntaxNode'


export class InlineCodeNode implements InlineSyntaxNode {
  constructor(public text: string) { }

  INLINE_SYNTAX_NODE(): void { }
  protected INLINE_CODE_NODE(): void { }
}
