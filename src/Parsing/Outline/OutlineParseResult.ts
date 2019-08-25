import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'


export type OutlineParseResult = null | {
  parsedNodes: OutlineSyntaxNode[]
  countLinesConsumed: number
}
