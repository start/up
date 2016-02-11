
const group = (pattern: string) => `(?:${pattern})`

const optional = (pattern: string) => pattern + '?'

const all = (pattern: string) => pattern + '*'

const atLeast = (count: number, pattern: string) => pattern + `{${count},}`

const either = (...patterns: string[]) => group(patterns.join('|'))

const whitespace = '[^\\S\\n]'

const lineOf = (pattern: string) => `^` + pattern + all(whitespace) + '$'

const streakOf = (char: string) => lineOf(atLeast(3, char))

const dottedStreakOf = (char: string) => lineOf(optional(' ') + atLeast(2, char + ' ') + char)

const BLANK_LINE = new RegExp(
  lineOf('')
)

// We don't need to check for the start or end of the string, because if a line
// contains a non-whitespace character anywhere in it, it's not blank.
const NON_BLANK_LINE = /\S/

export {
  NON_BLANK_LINE,
  BLANK_LINE,
  either,
  lineOf,
  streakOf,
  dottedStreakOf
}