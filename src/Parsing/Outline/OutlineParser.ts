import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'
import { HeadingLeveler } from './HeadingLeveler'
import { UpConfig } from '../../UpConfig'

export interface OutlineParser {
  (args: OutlineParserArgs): boolean
}

export interface OutlineParserArgs {
  text: string
  headingLeveler: HeadingLeveler
  config: UpConfig
  then: (resultNodes: OutlineSyntaxNode[], lengthParsed: number) => void
}
