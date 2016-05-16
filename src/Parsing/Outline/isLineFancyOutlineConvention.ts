import { parseSectionSeparatorStreak } from './ParseSectionSeparatorStreak'
import { parseBlankLineSeparation } from './parseBlankLineSeparation'
import { parseBlockquote } from './parseBlockquote'
import { parseUnorderedList } from './ParseUnorderedList'
import { parseOrderedList } from './parseOrderedList'
import { HeadingLeveler } from './HeadingLeveler'
import { UpConfig } from '../../UpConfig'


const OUTLINE_CONVENTIONS_POSSIBLY_ONE_LINE_LONG = [
  parseUnorderedList,
  parseOrderedList,
  parseSectionSeparatorStreak,
  parseBlockquote
]


// If `line` would be considered anything but a regular paragraph, it's considered fancy. 
export function isLineFancyOutlineConvention(line: string, config: UpConfig): boolean {
  
  return OUTLINE_CONVENTIONS_POSSIBLY_ONE_LINE_LONG.some(
    (parse) => parse({
      text: line,
      headingLeveler:  DUMMY_HEADING_LEVELER,
      config: config,
      then: () => { /* Do nothing */ }
    })
  )
}


// We don't care about heading levels!  We only care whether or not the line is a regular paragraph.
const DUMMY_HEADING_LEVELER = new HeadingLeveler()
