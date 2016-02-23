import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'

export interface OutlineParser {
  (args: OutlineParseArgs): boolean
}

export interface OutlineParseArgs {
  then: (resultNodes: SyntaxNode[]) => void
}