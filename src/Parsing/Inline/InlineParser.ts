import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { RichSyntaxNode } from '../../SyntaxNodes/RichSyntaxNode'

export interface InlineParser {
  (args: InlineParserArgs): boolean
}

export interface InlineParserArgs {
  text: string
  parentNode?: RichSyntaxNode
  endsWith?: string
  doesNotHave?: string
  then: (resultNodes: SyntaxNode[], lengthParsed: number) => void
}