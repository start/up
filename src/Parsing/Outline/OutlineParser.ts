import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'
import { UpConfig } from '../../UpConfig'

export interface OutlineParser {
  (args: OutlineParserArgs): boolean
}

export interface OutlineParserArgs {
  text: string,
  config: UpConfig
  then: (resultNodes: OutlineSyntaxNode[], lengthParsed: number) => void
}
