function group(pattern: string): string {
  return `(?:${pattern})`
}

function capture(pattern: string): string {
  return `(${pattern})`
}

function optional(pattern: string): string {
  return group(pattern) + '?'
}

function all(pattern: string): string {
  return group(pattern) + '*'
}

function atLeast(count: number, pattern: string): string {
  return group(pattern) + `{${count},}`
}

function exactly(count: number, pattern: string): string {
  return group(pattern) + `{${count}}`
}

function either(...patterns: string[]): string {
  return group(patterns.join('|'))
}

function solely(pattern: string) {
  return '^' + pattern + INLINE_WHITESPACE + '$'
}

function streakOf(charPattern: string): string {
  return solely(atLeast(3, charPattern))
}

function startsWith(pattern: string): string {
  return '^' + pattern
}

function endsWith(pattern: string): string {
  return pattern + '$'
}

const INLINE_WHITESPACE_CHAR =
  '[^\\S\\n]'

const WHITESPACE_CHAR =
  '\\s'

const ANY_WHITESPACE =
  all('\\s')

const INLINE_WHITESPACE =
  all('[^\\S\\n]')

const LINE_BREAK =
  '\n'

const INDENT =
  either('  ', '\t')

const STREAK_CHAR =
  either('#', '=', '-', '\\+', '~', '\\*', '\\^', '@', ':', '_')

const INTEGER =
  '\\d+'

const STREAK =
  solely(atLeast(3, STREAK_CHAR + ANY_WHITESPACE))

const NON_WHITESPACE_CHAR =
  '\\S'

const LETTER =
  '[a-zA-Z]'

const DIGIT =
  '\\d'

// We don't need to check for the start or end of the string, because if a line
// contains a non-whitespace character anywhere in it, it's not blank.
const NON_BLANK_PATTERN = new RegExp(
  NON_WHITESPACE_CHAR)

const BLANK_PATTERN = new RegExp(
  solely(''))


function escapeForRegex(text: string): string {
  return text.replace(/[(){}[\].+*?^$\\|-]/g, '\\$&')
}

function regExpStartingWith(pattern: string, flags?: string): RegExp {
  return new RegExp(startsWith(pattern), flags)
}

function regExpEndingWith(pattern: string, flags?: string): RegExp {
  return new RegExp(endsWith(pattern), flags)
}


export {
capture,
optional,
either,
solely,
startsWith,
endsWith,
streakOf,
all,
atLeast,
exactly,
escapeForRegex,
regExpStartingWith,
regExpEndingWith,
NON_BLANK_PATTERN,
BLANK_PATTERN,
INLINE_WHITESPACE_CHAR,
WHITESPACE_CHAR,
NON_WHITESPACE_CHAR,
INDENT,
ANY_WHITESPACE,
STREAK,
INTEGER,
LINE_BREAK,
LETTER,
DIGIT
}
