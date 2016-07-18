import { anyCharFrom, solely, either, exactly, streakOf, patternStartingWith } from './PatternHelpers'
import { INLINE_WHITESPACE_CHAR, ANY_WHITESPACE } from './PatternPieces'


const INDENT =
  either('\t', exactly(2, INLINE_WHITESPACE_CHAR))

export const INDENTED_PATTERN =
  patternStartingWith(INDENT)

const DIVIDER_STREAK_CHAR =
  anyCharFrom('#', '=', '-', '+', '~', '*', '^', '@', ':', '_')

export const DIVIDER_STREAK_PATTERN =
  streakOf(DIVIDER_STREAK_CHAR + ANY_WHITESPACE)

export const BLANK_PATTERN =
  solely('')

export const NON_BLANK_PATTERN =
  /\S/
