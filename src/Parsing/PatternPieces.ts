import { everyOptional, either, atLeast } from './PatternHelpers'


export const INLINE_WHITESPACE_CHAR =
  '[^\\S\\n]'

export const WHITESPACE_CHAR =
  '\\s'

export const ANY_WHITESPACE =
  everyOptional(WHITESPACE_CHAR)

export const SOME_WHITESPACE =
  atLeast(1, WHITESPACE_CHAR)

export const LINE_BREAK =
  '\n'

export const INTEGER =
  '\\d+'

export const LETTER =
  '[a-zA-Z]'

export const DIGIT =
  '\\d'
