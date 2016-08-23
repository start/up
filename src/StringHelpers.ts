import { escapeForRegex } from './Parsing/PatternHelpers'


export function isEqualIgnoringCapitalization(first: string, second: string): boolean {
  const pattern =
    new RegExp('^' + escapeForRegex(first) + '$', 'i')

  return pattern.test(second)
}


export function containsStringIgnoringCapitalization(args: { haystack: string, needle: string }): boolean {
  const pattern =
    new RegExp(escapeForRegex(args.needle), 'i')

  return pattern.test(args.haystack)
}