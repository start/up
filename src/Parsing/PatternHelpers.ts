export function group(pattern: string): string {
  return `(?:${pattern})`
}

export function capture(pattern: string): string {
  return `(${pattern})`
}

export function optional(pattern: string): string {
  return group(pattern) + '?'
}

export function everyOptional(pattern: string): string {
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

// Matches any character that matches any of the `charClasses`.
export function anyCharMatching(...charClasses: string[]): string {
  return `[${charClasses.join('')}]`
}

// Matches any character that does not match any of the `charClasses`.
export function anyCharNotMatching(...charClasses: string[]): string {
  return `[^${charClasses.join('')}]`
}

// Matches any character from the set of `chars`. Does not support patterns.
export function anyCharFrom(...chars: string[]): string {
  return anyCharMatching(...chars.map(escapeForRegex))
}

// Matches any character from the set of `chars`. Does not support patterns.
export function anyCharBut(...chars: string[]): string {
  return anyCharNotMatching(...chars.map(escapeForRegex))
}

export function followedBy(pattern: string): string {
  return `(?=${pattern})`
}

export function notFollowedBy(pattern: string): string {
  return `(?!${pattern})`
}

export function escapeForRegex(text: string): string {
  return text.replace(/[(){}[\].+*?^$\\|-]/g, '\\$&')
}

export function streakOf(charPattern: string): RegExp {
  return solely(atLeast(3, charPattern))
}

export function patternStartingWith(pattern: string): RegExp {
  return regExpFlagsStartingWith({ pattern })
}

export function patternIgnoringCapitalizationAndStartingWith(pattern: string): RegExp {
  return regExpFlagsStartingWith({ pattern, isCaseInsensitive: true })
}

export function patternEndingWith(pattern: string): RegExp {
  return new RegExp(pattern + '$')
}

import { ANY_WHITESPACE } from './PatternPieces'

export function solely(pattern: string): RegExp {
  return regExpSolelyConsistingOf({ pattern })
}

export function solelyAndIgnoringCapitalization(pattern: string): RegExp {
  return regExpSolelyConsistingOf({ pattern, isCaseInsensitive: true })
}

function regExpFlagsStartingWith(args: { pattern: string, isCaseInsensitive?: boolean }): RegExp {
  return new RegExp('^' + args.pattern, regExpFlags(args.isCaseInsensitive))
}

function regExpSolelyConsistingOf(args: { pattern: string, isCaseInsensitive?: boolean }): RegExp {
  return new RegExp('^' + args.pattern + ANY_WHITESPACE + '$', regExpFlags(args.isCaseInsensitive))
}

function regExpFlags(isCaseInsensitive: boolean): string {
  return (
    isCaseInsensitive
      ? 'i'
      : undefined)
}