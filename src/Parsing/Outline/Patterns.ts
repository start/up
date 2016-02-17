const group = (pattern: string) => `(?:${pattern})`

const optional = (pattern: string) => group(pattern) + '?'

const all = (pattern: string) => group(pattern) + '*'

const atLeast = (count: number, pattern: string) => group(pattern) + `{${count},}`

const either = (...patterns: string[]) => group(patterns.join('|'))

const WHITESPACE_CHAR = '[^\\S\\n]'

const solely = (pattern: string) => '^' + pattern + all(WHITESPACE_CHAR) + '$'

const streakOf = (charPattern: string) => solely(atLeast(3, charPattern))

const dottedStreakOf = (char: string) => solely(optional(' ') + atLeast(2, char + ' ') + char)

const startingWith = (pattern: string) => '^' + pattern

const BLANK = solely('')

const INDENT = either('  ', '\t')

// We don't need to check for the start or end of the string, because if a line
// contains a non-whitespace character anywhere in it, it's not blank.
const NON_BLANK = '\\S'

export {
  NON_BLANK,
  BLANK,
  WHITESPACE_CHAR,
  INDENT,
  optional,
  either,
  solely,
  streakOf,
  dottedStreakOf,
  startingWith
}