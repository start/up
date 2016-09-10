import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'
import { HeadingLeveler } from './HeadingLeveler'
import { Settings } from '../../Settings'


export interface OutlineParserArgs {
  markupLines: string[]
  sourceLineNumber: number
  headingLeveler: HeadingLeveler
  settings: Settings.Parsing
  then: (resultNodes: OutlineSyntaxNode[], countLinesConsumed: number) => void
}
