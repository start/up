import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'
import { HeadingLeveler } from './HeadingLeveler'
import { NormalizedSettings } from '../../NormalizedSettings'


export interface OutlineParserArgs {
  markupLines: string[]
  sourceLineNumber: number
  headingLeveler: HeadingLeveler
  settings: NormalizedSettings.Parsing
  then: (parsedNodes: OutlineSyntaxNode[], countLinesConsumed: number) => void
}
