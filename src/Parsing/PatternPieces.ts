import { everyOptional, atLeast, anyCharNotMatching, escapeForRegex } from './PatternHelpers'


export const INLINE_WHITESPACE_CHAR =
  anyCharNotMatching('\\S', '\\r', '\\n')

export const WHITESPACE_CHAR =
  '\\s'

export const ANY_WHITESPACE =
  everyOptional(WHITESPACE_CHAR)

export const SOME_WHITESPACE =
  atLeast(1, WHITESPACE_CHAR)

export const DIGIT =
  '\\d'

export const ANY_CHAR =
  '.'