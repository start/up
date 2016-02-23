import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'

export interface OutlineParser {
  (args: OutlineParserArgs): boolean
}

export interface OutlineParserArgs {
  text: string,
  then: (resultNodes: SyntaxNode[], lengthParsed: number) => void
}