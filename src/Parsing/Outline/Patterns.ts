const group = (pattern: string) => `(?:${pattern})`

const optional = (pattern: string) => group(pattern) + '?'

const any = (pattern: string) => group(pattern) + '*'

const atLeast = (count: number, pattern: string) => group(pattern) + `{${count},}`

const either = (...patterns: string[]) => group(patterns.join('|'))

const INLINE_WHITESPACE_CHAR = '[^\\S\\n]'

const ANY_WHITESPACE = any('\\s')

const INLINE_WHITESPACE = any('[^\\S\\n]')

const solely = (pattern: string) => '^' + pattern + INLINE_WHITESPACE + '$'

const streakOf = (charPattern: string) => solely(atLeast(3, charPattern))

const dottedStreakOf = (char: string) => solely(optional(' ') + atLeast(2, char + ' ') + char)

const startsWith = (pattern: string) => '^' + pattern

const endsWith = (pattern: string) => pattern + '$'

const BLANK = solely('')

const INDENT = either('  ', '\t')

const STREAK_CHAR = either('#', '=', '-', '\\+', '~', '\\*', '\\^', '@', ':', '_')

const STREAK = solely(ANY_WHITESPACE + atLeast(3, STREAK_CHAR + ANY_WHITESPACE))

// We don't need to check for the start or end of the string, because if a line
// contains a non-whitespace character anywhere in it, it's not blank.
const NON_BLANK = '\\S'

export {
  NON_BLANK,
  BLANK,
  INLINE_WHITESPACE_CHAR,
  INDENT,
  ANY_WHITESPACE,
  STREAK,
  optional,
  either,
  solely,
  startsWith,
  endsWith,
  streakOf,
  dottedStreakOf
}