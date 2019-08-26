import { NormalizedSettings } from '../../NormalizedSettings'
import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'
import { HeadingLeveler } from './HeadingLeveler'


export namespace OutlineParser {
  export interface Args {
    markupLines: string[]
    sourceLineNumber: number
    headingLeveler: HeadingLeveler
    settings: NormalizedSettings.Parsing
  }

  export type Result = null | {
    parsedNodes: OutlineSyntaxNode[]
    countLinesConsumed: number
  }
}
