import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { TextConsumer } from '../TextConsumer'
import { parseSectionSeparatorStreak } from './ParseSectionSeparatorStreak'
import { getHeadingParser } from './GetHeadingParser'
import { parseBlankLineSeparation } from './ParseBlankLineSeparation'
import { parseLineBlock } from './ParseLineBlock'
import { parseCodeBlock } from './ParseCodeBlock'
import { parseBlockquote } from './ParseBlockquote'
import { parseUnorderedList } from './ParseUnorderedList'
import { parseOrderedList } from './ParseOrderedList'
import { startsWith, endsWith, BLANK, ANY_WHITESPACE} from './Patterns'
import { last } from '../CollectionHelpers'
import { HeadingLeveler, isUnderlineConsistentWithOverline} from './HeadingLeveler'

const SINGLE_LINE_OUTLINE_CONVENTIONS = [
  parseUnorderedList,
  parseOrderedList,
  parseSectionSeparatorStreak,
  parseBlockquote
]

// If `line` would be considered anything but a regular paragraph, it's considered fancy. 
export function isLineFancyOutlineConvention(line: string): boolean {
  for (const parser of SINGLE_LINE_OUTLINE_CONVENTIONS) {
    if (parser({ text: line, then: () => { } })) {
      return true
    }
  }

  return false
}