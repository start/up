import { solely, either, atLeast, streakOf, regExpStartingWith } from './PatternHelpers'
import { ANY_WHITESPACE } from './PatternPieces'


const DIVIDER_STREAK_CHAR =
  either('#', '=', '-', '\\+', '~', '\\*', '\\^', '@', ':', '_')

const DIVIDER_STREAK_PATTERN = new RegExp(
  streakOf(DIVIDER_STREAK_CHAR + ANY_WHITESPACE))

const BLANK_PATTERN = new RegExp(
  solely(''))

// We don't need to check for the start or end of the string, because if a line
// contains a non-whitespace character anywhere in it, it's not blank.
const NON_BLANK_PATTERN =
  /\S/

const INDENT =
  either('  ', '\t')

const INDENTED_PATTERN =
  regExpStartingWith(INDENT)


export {
  DIVIDER_STREAK_PATTERN,
  BLANK_PATTERN,
  NON_BLANK_PATTERN,
  INDENTED_PATTERN
}
