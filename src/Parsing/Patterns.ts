import { anyCharFrom, solely, either, exactly, streakOf, escapeForRegex, regExpStartingWith } from './PatternHelpers'
import { INLINE_WHITESPACE_CHAR, ANY_WHITESPACE } from './PatternPieces'


const INDENT =
  either('\t', exactly(2, INLINE_WHITESPACE_CHAR))

export const INDENTED_PATTERN =
  regExpStartingWith(INDENT)

const DIVIDER_STREAK_CHAR =
  anyCharFrom(
    ['#', '=', '-', '+', '~', '*', '^', '@', ':', '_'].map(escapeForRegex))

export const DIVIDER_STREAK_PATTERN = new RegExp(
  streakOf(DIVIDER_STREAK_CHAR + ANY_WHITESPACE))

export const BLANK_PATTERN = new RegExp(
  solely(''))

export const NON_BLANK_PATTERN =
  /\S/
