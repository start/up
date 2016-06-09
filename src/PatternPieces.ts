import { all, either } from './PatternHelpers'


export const INLINE_WHITESPACE_CHAR =
  '[^\\S\\n]'

export const WHITESPACE_CHAR =
  '\\s'

export const ANY_WHITESPACE =
  all('\\s')

export const LINE_BREAK =
  '\n'

export const INTEGER =
  '\\d+'

export const LETTER =
  '[a-zA-Z]'

export const DIGIT =
  '\\d'
