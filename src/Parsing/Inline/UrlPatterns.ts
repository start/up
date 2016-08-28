import { escapeForRegex, patternStartingWith, everyOptional, either, atLeastOne, anyCharMatching  } from '../PatternHelpers'
import { LETTER_CLASS, DIGIT } from '../PatternPieces'


// Our URL patterns and associated string constants serve two purposes:
//
// 1. To apply URL config settings
// 2. To determine when bracketed text is intended to be a link URL. For more information, see the comments
//    for the `getLinkUrlConventions` method in the `tokenizer.ts`.
//
// One important thing to note about that second point:
//
// We aren't in the business of exhaustively excluding every invalid URL. Instead, we simply want to avoid
// surprising the author by producing a link when they probably didn't intend to produce one.

export const LETTER_CHAR =
  anyCharMatching(LETTER_CLASS)

export const URL_SCHEME_NAME =
  LETTER_CHAR + everyOptional(
    anyCharMatching(
      LETTER_CLASS, DIGIT, ...['-', '+', '.'].map(escapeForRegex)))

export const URL_SCHEME =
  URL_SCHEME_NAME + ':' + everyOptional('/')

export const URL_SCHEME_PATTERN =
  patternStartingWith(URL_SCHEME)

export const FORWARD_SLASH =
  '/'

export const HASH_MARK =
  '#'

export const SUBDOMAIN =
  anyCharMatching(LETTER_CLASS, DIGIT)
  + everyOptional(
    anyCharMatching(LETTER_CLASS, DIGIT, escapeForRegex('-')))

export const TOP_LEVEL_DOMAIN =
  atLeastOne(LETTER_CHAR)

export const DOMAIN_PART_WITH_TOP_LEVEL_DOMAIN =
  atLeastOne(SUBDOMAIN + escapeForRegex('.')) + TOP_LEVEL_DOMAIN

export const EXPLICIT_URL_PREFIX =
  either(
    URL_SCHEME,
    FORWARD_SLASH,
    HASH_MARK)
    