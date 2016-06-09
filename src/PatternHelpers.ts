import { INLINE_WHITESPACE } from './PatternPieces'
  
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
regExpEndingWith
}
