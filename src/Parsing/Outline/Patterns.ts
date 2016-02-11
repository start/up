
const group = (pattern: string) => `(?:${pattern})`

const optional = (pattern: string) => pattern + '?'

const all = (pattern: string) => pattern + '*'

const atLeast = (pattern: string, count: number) => pattern + `{${atLeast},}`

const either = (...patterns: string[]) => group(patterns.join('|'))

const lineOf = (pattern: string) => `^` + pattern + '$'

const space = '[^\\S\n]'

const BLANK_LINE = new RegExp(lineOf(all(space)))

export {
   BLANK_LINE
}