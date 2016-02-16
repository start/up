const group = (pattern: string) => `(?:${pattern})`

const optional = (pattern: string) => group(pattern) + '?'

const all = (pattern: string) => group(pattern) + '*'

const atLeast = (count: number, pattern: string) => group(pattern) + `{${count},}`

const either = (...patterns: string[]) => group(patterns.join('|'))

const WHITESPACE_CHAR = '[^\\S\\n]'

const lineOf = (pattern: string) => '^' + pattern + all(WHITESPACE_CHAR) + '$'

const streakOf = (charPattern: string) => lineOf(atLeast(3, charPattern))

const dottedStreakOf = (char: string) => lineOf(optional(' ') + atLeast(2, char + ' ') + char)

const lineStartingWith = (pattern: string) => '^' + pattern

const BLANK_LINE = lineOf('')

const INDENT = either('  ', '\t')

// We don't need to check for the start or end of the string, because if a line
// contains a non-whitespace character anywhere in it, it's not blank.
const NON_BLANK_LINE = '\\S'

export {
  NON_BLANK_LINE,
  BLANK_LINE,
  WHITESPACE_CHAR,
  INDENT,
  optional,
  either,
  lineOf,
  streakOf,
  dottedStreakOf,
  lineStartingWith
}