import { InlineSyntaxNode } from './InlineSyntaxNode'


export class InlineCode implements InlineSyntaxNode {
  constructor(public code: string) { }

  text(): string {
    return this.code
  }
}
