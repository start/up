import { all, either, solely, atLeast } from './PatternHelpers'


const INLINE_WHITESPACE_CHAR =
  '[^\\S\\n]'

const WHITESPACE_CHAR =
  '\\s'

const ANY_WHITESPACE =
  all('\\s')

const LINE_BREAK =
  '\n'

const INDENT =
  either('  ', '\t')

const INTEGER =
  '\\d+'

const LETTER =
  '[a-zA-Z]'

const DIGIT =
  '\\d'


export {
  INLINE_WHITESPACE_CHAR,
  WHITESPACE_CHAR,
  INDENT,
  ANY_WHITESPACE,
  INTEGER,
  LINE_BREAK,
  LETTER,
  DIGIT
}
