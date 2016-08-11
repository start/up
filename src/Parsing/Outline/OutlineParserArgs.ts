import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'
import { HeadingLeveler } from './HeadingLeveler'
import { Config } from '../../Config'


export interface OutlineParserArgs {
  markupLines: string[]
  sourceLineNumber: number
  headingLeveler: HeadingLeveler
  config: Config
  then: (resultNodes: OutlineSyntaxNode[], countLinesConsumed: number) => void
}
