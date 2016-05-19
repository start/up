import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'

export interface ParseResult {
  nodes: InlineSyntaxNode[]
  countTokensParsed: number
  isMissingTerminator: boolean
}
