import { NormalizedSettings } from '../../NormalizedSettings'
import { HeadingLeveler } from './HeadingLeveler'
import { tryToParseBlockquote } from './tryToParseBlockquote'
import { tryToParseBulletedList } from './tryToParseBulletedList'
import { tryToParseCodeBlock } from './tryToParseCodeBlock'
import { tryToParseNumberedList } from './tryToParseNumberedList'
import { tryToParseThematicBreakStreak } from './tryToParseThematicBreakStreak'


const OUTLINE_CONVENTIONS_POSSIBLY_ONE_LINE_LONG = [
  tryToParseBulletedList,
  tryToParseNumberedList,
  tryToParseThematicBreakStreak,
  tryToParseBlockquote,
  tryToParseCodeBlock
]


// We don't care about heading levels or source line numbers!  We only care whether this line
// is a regular paragraph.
const DUMMY_HEADING_LEVELER = new HeadingLeveler()
const DUMMY_SOURCE_LINE_NUMBER = 1


// If `markupLine` would be considered anything but a regular paragraph, it's considered fancy.
//
// TODO: Make this function less disastrously wasteful. Currently, if `markupLine` does represent
// a fancy outline convention, its contents are fully parsed.
export function isLineFancyOutlineConvention(markupLine: string, settings: NormalizedSettings.Parsing): boolean {
  const markupLines = [markupLine]

  return OUTLINE_CONVENTIONS_POSSIBLY_ONE_LINE_LONG.some(
    parse => parse({
      markupLines,
      settings,
      sourceLineNumber: DUMMY_SOURCE_LINE_NUMBER,
      headingLeveler: DUMMY_HEADING_LEVELER
    }))
}
