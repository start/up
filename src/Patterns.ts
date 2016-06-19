import { char, solely, either, streakOf, escapeForRegex, regExpStartingWith } from './PatternHelpers'
import { ANY_WHITESPACE } from './PatternPieces'


const INDENT =
  either('  ', '\t')

export const INDENTED_PATTERN =
  regExpStartingWith(INDENT)

const DIVIDER_STREAK_CHAR =
  char(
    ['#', '=', '-', '+', '~', '*', '^', '@', ':', '_'].map(escapeForRegex))

export const DIVIDER_STREAK_PATTERN = new RegExp(
  streakOf(DIVIDER_STREAK_CHAR + ANY_WHITESPACE))

export const BLANK_PATTERN = new RegExp(
  solely(''))

export const NON_BLANK_PATTERN =
  /\S/
