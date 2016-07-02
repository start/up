import { tryToParseUnorderedList } from './tryToParseUnorderedList'
import { trytoParseOrderedList } from './tryToParseOrderedList'
import { tryToParseSectionSeparatorStreak } from './tryToParseSectionSeparatorStreak'
import { tryToParseBlockquote } from './tryToParseBlockquote'
import { tryToParseCodeBlock } from './tryToParseCodeBlock'
import { HeadingLeveler } from './HeadingLeveler'
import { UpConfig } from '../../UpConfig'


const OUTLINE_CONVENTIONS_POSSIBLY_ONE_LINE_LONG = [
  tryToParseUnorderedList,
  trytoParseOrderedList,
  tryToParseSectionSeparatorStreak,
  tryToParseBlockquote,
  tryToParseCodeBlock
]


// If `line` would be considered anything but a regular paragraph, it's considered fancy. 
export function isLineFancyOutlineConvention(line: string, config: UpConfig): boolean {
  const lines = [line]

  return OUTLINE_CONVENTIONS_POSSIBLY_ONE_LINE_LONG.some(
    parse => parse({
      lines,
      headingLeveler: DUMMY_HEADING_LEVELER,
      config: config,
      then: () => { /* Do nothing */ }
    })
  )
}


// We don't care about heading levels!  We only care whether or not the line is a regular paragraph.
const DUMMY_HEADING_LEVELER = new HeadingLeveler()
