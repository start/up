import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { RichSyntaxNode } from '../../SyntaxNodes/RichSyntaxNode'

export interface OutlineParser {
  (args: OutlineParserArgs): boolean
}

export interface OutlineParserArgs {
  text: string,
  parentNode?: RichSyntaxNode,
  terminator?: string
  then: (resultNodes: SyntaxNode[], lengthParsed: number) => void
}