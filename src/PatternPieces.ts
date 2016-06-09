import { all, either } from './PatternHelpers'


const INLINE_WHITESPACE_CHAR =
  '[^\\S\\n]'

const WHITESPACE_CHAR =
  '\\s'

const ANY_WHITESPACE =
  all('\\s')

const LINE_BREAK =
  '\n'

const INTEGER =
  '\\d+'

const LETTER =
  '[a-zA-Z]'

const DIGIT =
  '\\d'


export {
  INLINE_WHITESPACE_CHAR,
  WHITESPACE_CHAR,
  ANY_WHITESPACE,
  INTEGER,
  LINE_BREAK,
  LETTER,
  DIGIT
}
