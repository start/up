import { all, either, solely, atLeast } from './PatternHelpers'


const INLINE_WHITESPACE_CHAR =
  '[^\\S\\n]'

const WHITESPACE_CHAR =
  '\\s'

const ANY_WHITESPACE =
  all('\\s')

const INLINE_WHITESPACE =
  all(INLINE_WHITESPACE_CHAR)

const LINE_BREAK =
  '\n'

const INDENT =
  either('  ', '\t')

const STREAK_CHAR =
  either('#', '=', '-', '\\+', '~', '\\*', '\\^', '@', ':', '_')

const INTEGER =
  '\\d+'

const STREAK =
  solely(atLeast(3, STREAK_CHAR + ANY_WHITESPACE))

const LETTER =
  '[a-zA-Z]'

const DIGIT =
  '\\d'


export {
  INLINE_WHITESPACE_CHAR,
  INLINE_WHITESPACE,
  WHITESPACE_CHAR,
  INDENT,
  ANY_WHITESPACE,
  STREAK,
  INTEGER,
  LINE_BREAK,
  LETTER,
  DIGIT
}
