import { InlineSyntaxNode } from './InlineSyntaxNode'


export class InlineCodeNode implements InlineSyntaxNode {
  constructor(public code: string) { }

  text(): string {
    return this.code
  }

  INLINE_SYNTAX_NODE(): void { }
  protected INLINE_CODE_NODE(): void { }
}
