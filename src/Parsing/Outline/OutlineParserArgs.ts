import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'
import { HeadingLeveler } from './HeadingLeveler'
import { UpConfig } from '../../UpConfig'


export interface OutlineParserArgs {
  lines: string[]
  headingLeveler: HeadingLeveler
  config: UpConfig
  then: (resultNodes: OutlineSyntaxNode[], countLinesConsumed: number) => void
}
