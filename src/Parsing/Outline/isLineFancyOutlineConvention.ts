import { tryToParseUnorderedList } from './tryToParseUnorderedList'
import { trytoParseOrderedList } from './tryToParseOrderedList'
import { tryToParseThematicBreakStreak } from './tryToParseThematicBreakStreak'
import { tryToParseBlockquote } from './tryToParseBlockquote'
import { tryToParseCodeBlock } from './tryToParseCodeBlock'
import { HeadingLeveler } from './HeadingLeveler'
import { Config } from '../../Config'


const OUTLINE_CONVENTIONS_POSSIBLY_ONE_LINE_LONG = [
  tryToParseUnorderedList,
  trytoParseOrderedList,
  tryToParseThematicBreakStreak,
  tryToParseBlockquote,
  tryToParseCodeBlock
]


// We don't care about heading levels or source line numbers!  We only care whether or not
// the line is a regular paragraph.
const DUMMY_HEADING_LEVELER = new HeadingLeveler()
const DUMMY_SOURCE_LINE_NUMBER = 1


// If `line` would be considered anything but a regular paragraph, it's considered fancy. 
export function isLineFancyOutlineConvention(markupLine: string, config: Config): boolean {
  const markupLines = [markupLine]

  return OUTLINE_CONVENTIONS_POSSIBLY_ONE_LINE_LONG.some(
    parse => parse({
      markupLines,
      sourceLineNumber: DUMMY_SOURCE_LINE_NUMBER,
      headingLeveler: DUMMY_HEADING_LEVELER,
      config: config,
      then: () => { /* Do nothing */ }
    }))
}
