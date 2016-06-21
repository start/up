export function group(pattern: string): string {
  return `(?:${pattern})`
}

export function capture(pattern: string): string {
  return `(${pattern})`
}

export function optional(pattern: string): string {
  return group(pattern) + '?'
}

export function all(pattern: string): string {
  return group(pattern) + '*'
}

export function atLeast(count: number, pattern: string): string {
  return group(pattern) + `{${count},}`
}

export function exactly(count: number, pattern: string): string {
  return group(pattern) + `{${count}}`
}

export function either(...patterns: string[]): string {
  return group(patterns.join('|'))
}

export function streakOf(charPattern: string): string {
  return solely(atLeast(3, charPattern))
}

export function char(charPatterns: string[]): string {
  return `[${charPatterns.join('')}]`
}

export function charOtherThan(charPatterns: string[]): string {
  return `[^${charPatterns.join('')}]`
}

export function escapeForRegex(text: string): string {
  return text.replace(/[(){}[\].+*?^$\\|-]/g, '\\$&')
}

export function regExpStartingWith(pattern: string, flags?: string): RegExp {
  return new RegExp('^' + pattern, flags)
}

export function regExpEndingWith(pattern: string, flags?: string): RegExp {
  return new RegExp(pattern + '$', flags)
}

import { INLINE_WHITESPACE_CHAR } from './PatternPieces'

export function solely(pattern: string) {
  return '^' + pattern + all(INLINE_WHITESPACE_CHAR) + '$'
}
