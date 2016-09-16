import { tryToParseUnorderedList } from './tryToParseUnorderedList'
import { trytoParseOrderedList } from './tryToParseOrderedList'
import { tryToParseThematicBreakStreak } from './tryToParseThematicBreakStreak'
import { tryToParseBlockquote } from './tryToParseBlockquote'
import { tryToParseCodeBlock } from './tryToParseCodeBlock'
import { HeadingLeveler } from './HeadingLeveler'
import { Settings } from '../../Settings'


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


// If `markupLine` would be considered anything but a regular paragraph, it's considered fancy.
//
// TODO: Make this method less disastrously wasteful. Currently, if `markupLine` does represent
// a fancy outline convention, its contents are fully parsed.
export function isLineFancyOutlineConvention(markupLine: string, settings: Settings.Parsing): boolean {
  const markupLines = [markupLine]

  return OUTLINE_CONVENTIONS_POSSIBLY_ONE_LINE_LONG.some(
    parse => parse({
      markupLines,
      settings,
      sourceLineNumber: DUMMY_SOURCE_LINE_NUMBER,
      headingLeveler: DUMMY_HEADING_LEVELER,
      then: () => { /* Do nothing */ }
    }))
}
