
const group = (pattern: string) => `(?:${pattern})`

const optional = (pattern: string) => pattern + '?'

const all = (pattern: string) => pattern + '*'

const atLeast = (pattern: string, count: number) => pattern + `{${atLeast},}`

const either = (...patterns: string[]) => group(patterns.join('|'))

const lineOf = (pattern: string) => `^` + pattern + '$'

const space = '[^\\S\n]'

const BLANK_LINE = new RegExp(
  lineOf(all(space))
)

// We don't need to check for the start or end of the string, because if a line
// contains a non-whitespace character anywhere in it, it's not blank.
const NON_BLANK_LINE = /\S/

export {
  NON_BLANK_LINE,
  BLANK_LINE
}