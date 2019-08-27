import { anyCharFrom, either, exactly, patternStartingWith, solely, streakOf } from './PatternHelpers'
import { INLINE_WHITESPACE_CHAR, URL_SCHEME, WHITESPACE_CHAR } from './PatternPieces'


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

export const WHITESPACE_CHAR_PATTERN =
  new RegExp(WHITESPACE_CHAR)

export const URL_SCHEME_PATTERN =
  patternStartingWith(URL_SCHEME)
