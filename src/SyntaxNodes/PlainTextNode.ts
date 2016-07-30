import { InlineSyntaxNode } from './InlineSyntaxNode'


export class PlainTextNode implements InlineSyntaxNode {
  constructor(public content: string) { }

  text(): string {
    return this.content
  }

  INLINE_SYNTAX_NODE(): void { }
  protected PLAIN_TEXT_NODE(): void { }
}
