import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { parseSectionSeparatorStreak } from './ParseSectionSeparatorStreak'
import { parseBlankLineSeparation } from './ParseBlankLineSeparation'
import { parseBlockquote } from './ParseBlockquote'
import { parseUnorderedList } from './ParseUnorderedList'
import { parseOrderedList } from './ParseOrderedList'
import { last } from '../CollectionHelpers'

const SINGLE_LINE_OUTLINE_PARSERS = [
  parseUnorderedList,
  parseOrderedList,
  parseSectionSeparatorStreak,
  parseBlockquote
]

// If `line` would be considered anything but a regular paragraph, it's considered fancy. 
export function isLineFancyOutlineConvention(line: string): boolean {
  return SINGLE_LINE_OUTLINE_PARSERS.some(
    (parse) => parse({ text: line, then: () => { } })
  )
}
