import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { SuccessfulParseResult } from './SuccessfulParseResult'
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
  options.parsers = options.parsers || []

  function isMatch(needle: string): boolean {
    return needle === text.substr(index, needle.length)
  }
  
  main_parser_loop:
  for (index = 0; index < text.length; index++) {
    const char = text[index]

    if (isEscaped) {
      nodes.push(new PlainTextNode(char))
      isEscaped = false
      continue
    }

    if (char === '\\') {
      isEscaped = true
      continue
    }

    if (index === 0 && options.startsWith) {
      if (isMatch(options.startsWith)) {
        // We subtract 1 because the loop automatically incremements by 1
        index += options.startsWith.length - 1
        continue
      } else {
        return new FailedParseResult()
      }
    }

    if (options.endsWith && isMatch(options.endsWith)) {
      return new SuccessfulParseResult(nodes, index + options.endsWith.length)
    }

    for (let parser of options.parsers) {
      const result = parser(text.slice(index), parentNode)
      if (result.success()) {
        nodes.push.apply(nodes, result.nodes)
        // We subtract 1 because the loop automatically incremements by 1
        index += result.countCharsConsumed - 1
        continue main_parser_loop
      }
    }

    nodes.push(new PlainTextNode(char))
  }

  if (options.endsWith) {
    return new FailedParseResult()
  }

  return new SuccessfulParseResult(nodes, text.length)
}
