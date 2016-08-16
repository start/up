import { patternStartingWith, patternEndingWith } from './Parsing/PatternHelpers'
import { ANY_WHITESPACE } from './Parsing/PatternPieces'


// Browser support for `trimLeft` and `trimRight` is poor, particularly on mobile.

export function trimLeadingWhitespace(text: string): string {
  return text.replace(LEADING_WHITESPACE_PATTERN, '')
}

export function trimTrailingWhitespace(text: string): string {
  return text.replace(TRAILING_WHITESPACE_PATTERN, '')
}


const LEADING_WHITESPACE_PATTERN =
  patternStartingWith(ANY_WHITESPACE)

const TRAILING_WHITESPACE_PATTERN =
  patternEndingWith(ANY_WHITESPACE)