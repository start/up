import { NormalizedSettings } from '../../NormalizedSettings'
import { HeadingLeveler } from './HeadingLeveler'


export interface OutlineParserArgs {
  markupLines: string[]
  sourceLineNumber: number
  headingLeveler: HeadingLeveler
  settings: NormalizedSettings.Parsing
}
