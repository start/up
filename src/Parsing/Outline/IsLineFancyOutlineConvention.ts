import { parseSectionSeparatorStreak } from './ParseSectionSeparatorStreak'
import { parseBlankLineSeparation } from './ParseBlankLineSeparation'
import { parseBlockquote } from './ParseBlockquote'
import { parseUnorderedList } from './ParseUnorderedList'
import { parseOrderedList } from './ParseOrderedList'
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
      config: config,
      then: () => { /* Do nothing */ }
    })
  )
}
