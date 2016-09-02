import { escapeForRegex } from './PatternHelpers'


// Returns a new string consisting of `count` copies of `text`
export function repeat(text: string, count: number): string {
  return new Array(count + 1).join(text)
}

// Returns true if `first` equals `second` (ignoring any capitalization)
export function isEqualIgnoringCapitalization(first: string, second: string): boolean {
  const pattern =
    new RegExp('^' + escapeForRegex(first) + '$', 'i')

  return pattern.test(second)
}

// Returns true if `haystack` contains `needle` (ignoring any capitalization)
export function containsStringIgnoringCapitalization(args: { haystack: string, needle: string }): boolean {
  const pattern =
    new RegExp(escapeForRegex(args.needle), 'i')

  return pattern.test(args.haystack)
}
