import { NormalizedSettings } from '../../NormalizedSettings'
import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'
import { HeadingLeveler } from './HeadingLeveler'


export interface OutlineParserArgs {
  markupLines: string[]
  sourceLineNumber: number
  headingLeveler: HeadingLeveler
  settings: NormalizedSettings.Parsing
  then: (parsedNodes: OutlineSyntaxNode[], countLinesConsumed: number) => void
}
