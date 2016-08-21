import { InlineSyntaxNode } from './InlineSyntaxNode'


export class PlainText implements InlineSyntaxNode {
  constructor(public content: string) { }

  text(): string {
    return this.content
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return []
  }

  protected PLAIN_TEXT(): void { }
}
