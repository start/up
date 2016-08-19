import { InlineSyntaxNode } from './InlineSyntaxNode'


export class PlainTextNode implements InlineSyntaxNode {
  constructor(public content: string) { }

  inlineTextContent(): string {
    return this.content
  }

  protected PLAIN_TEXT(): void { }
}
