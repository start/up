import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'

export interface OutlineParser {
  (args: OutlineParserArgs): boolean
}

export interface OutlineParserArgs {
  text: string,
  then: (resultNodes: OutlineSyntaxNode[], lengthParsed: number) => void
}
