const group =
  (pattern: string) => `(?:${pattern})`

const capture =
  (pattern: string) => `(${pattern})`

const optional =
  (pattern: string) => group(pattern) + '?'

const all =
  (pattern: string) => group(pattern) + '*'

const atLeast =
  (count: number, pattern: string) => group(pattern) + `{${count},}`

const exactly =
  (count: number, pattern: string) => group(pattern) + `{${count}}`

const either =
  (...patterns: string[]) => group(patterns.join('|'))

const solely =
  (pattern: string) => '^' + pattern + INLINE_WHITESPACE + '$'

const streakOf =
  (charPattern: string) => solely(atLeast(3, charPattern))

const startsWith =
  (pattern: string) => '^' + pattern

const endsWith =
  (pattern: string) => pattern + '$'

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

const BLANK =
  solely('')

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
const NON_BLANK_PATTERN =
  new RegExp(NON_WHITESPACE_CHAR)


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
  BLANK,
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
