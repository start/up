import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { ParseResult } from './ParseResult'
import { FailedParseResult } from './FailedParseResult'
import { Parser } from './Parser'

interface ParseOptions {
  parsers?: Parser[],
  startsWith?: string
  endsWith?: string
}

export function parse(text: string, parentNode: RichSyntaxNode, options: ParseOptions): ParseResult {
  let nodes: SyntaxNode[] = []
  let isEscaped = false
  let index: number

  function isMatch(needle: string): boolean {
    return needle && needle === text.substr(index, needle.length)
  }

  main_parser_loop:
  for (index = 0; index < text.length; index++) {
    const char = text[index]

    if (isEscaped || char !== '\\') {
      nodes.push(new PlainTextNode(char))
      isEscaped = false
      continue
    }

    if (char === '\\') {
      isEscaped = true
      continue
    }

    if (index === 0) {
      if (isMatch(options.startsWith)) {
        // We subtract 1 because the loop automatically incremements by 1
        index += options.startsWith.length - 1
        continue
      } else {
        return new FailedParseResult()
      }
    }

    if (isMatch(options.endsWith)) {
      return new ParseResult(nodes, index + options.endsWith.length)
    }

    for (let parser of options.parsers) {
      const result = parser(text, parentNode)
      if (result.success) {
        nodes.push.apply(nodes, result.nodes)
        continue main_parser_loop
      }
    }

    nodes.push(new PlainTextNode(char))
  }

  if (options.endsWith) {
    return new FailedParseResult()
  }

  return new ParseResult(nodes, text.length)
}
