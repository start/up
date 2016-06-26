import { anyOptional, atLeast, anyCharFrom } from './PatternHelpers'


export const INLINE_WHITESPACE_CHAR =
  '[^\\S\\n]'

export const WHITESPACE_CHAR =
  '\\s'


export const ANY_WHITESPACE =
  anyOptional(WHITESPACE_CHAR)

export const SOME_WHITESPACE =
  atLeast(1, WHITESPACE_CHAR)


export const LETTER_CLASS =
  'a-zA-Z'

export const LETTER_CHAR =
  anyCharFrom([LETTER_CLASS])


export const DIGIT_CLASS = 
  '\\d'

// We have both `DIGIT_CLASS` and `DIGIT_CHAR` only for consistency
export const DIGIT_CHAR =
  DIGIT_CLASS

export const INTEGER =
  atLeast(1, DIGIT_CHAR)