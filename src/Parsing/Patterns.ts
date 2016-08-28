import { anyCharFrom, solely, either, exactly, streakOf, patternStartingWith } from './PatternHelpers'
import { INLINE_WHITESPACE_CHAR, URL_SCHEME } from './PatternPieces'


const INDENT =
  either('\t', exactly(2, INLINE_WHITESPACE_CHAR))

export const INDENTED_PATTERN =
  patternStartingWith(INDENT)

export const DIVIDER_STREAK_PATTERN =
  streakOf(
    anyCharFrom('#', '=', '-', '+', '~', '*', '@', ':'))

export const BLANK_PATTERN =
  solely('')

export const NON_BLANK_PATTERN =
  /\S/

export const URL_SCHEME_PATTERN =
  patternStartingWith(URL_SCHEME)
