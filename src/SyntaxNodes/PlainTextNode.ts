import { InlineSyntaxNode } from './InlineSyntaxNode'


export class PlainTextNode implements InlineSyntaxNode {
  constructor(public text: string) { }

  INLINE_SYNTAX_NODE(): void { }
  protected PLAIN_TEXT_NODE(): void { }
}
