import { solely } from './PatternHelpers'


const BLANK_PATTERN = new RegExp(
  solely(''))

// We don't need to check for the start or end of the string, because if a line
// contains a non-whitespace character anywhere in it, it's not blank.
const NON_BLANK_PATTERN =
  /\S/


export {
  NON_BLANK_PATTERN,
  BLANK_PATTERN,
}
