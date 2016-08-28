import { anyCharMatching, everyOptional, atLeastOne, anyCharNotMatching, escapeForRegex } from './PatternHelpers'


export const INLINE_WHITESPACE_CHAR =
  anyCharNotMatching('\\S', '\\r', '\\n')

export const WHITESPACE_CHAR =
  '\\s'

export const ANY_WHITESPACE =
  everyOptional(WHITESPACE_CHAR)

export const SOME_WHITESPACE =
  atLeastOne(WHITESPACE_CHAR)

export const LETTER_CLASS =
  'a-zA-Z'

export const DIGIT =
  '\\d'

export const ANY_CHAR =
  '.'

export const REST_OF_TEXT =
  everyOptional(ANY_CHAR)

export const FORWARD_SLASH =
  '/'

export const HASH_MARK =
  '#'

export const LETTER_CHAR =
  anyCharMatching(LETTER_CLASS)

const URL_SCHEME_NAME =
  LETTER_CHAR + everyOptional(
    anyCharMatching(
      LETTER_CLASS, DIGIT, ...['-', '+', '.'].map(escapeForRegex)))

export const URL_SCHEME =
  URL_SCHEME_NAME + ':' + everyOptional('/')
