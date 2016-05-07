import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'

export class ParseResult {
  constructor(
    public nodes: InlineSyntaxNode[],
    public countTokensParsed: number) { }
}
