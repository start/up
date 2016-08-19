import { InlineSyntaxNode } from './InlineSyntaxNode'


export class InlineCode implements InlineSyntaxNode {
  constructor(public code: string) { }

  inlineTextContent(): string {
    return this.code
  }
}
