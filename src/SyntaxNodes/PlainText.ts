import { InlineSyntaxNode } from './InlineSyntaxNode'


export class PlainText implements InlineSyntaxNode {
  constructor(public content: string) { }

  text(): string {
    return this.content
  }

  protected PLAIN_TEXT(): void { }
}
