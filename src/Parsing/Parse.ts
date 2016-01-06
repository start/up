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
  endsWith?: string,
  exitBefore?: string
}

export function parse(text: string, parentNode: RichSyntaxNode, options: ParseOptions): ParseResult {
  let nodes: SyntaxNode[] = []
  let isEscaped = false
  options.parsers = options.parsers || []
  
  let index = 0

  function isMatch(needle: string): boolean {
    return needle === text.substr(index, needle.length)
  }
  
  main_parser_loop:
  while (index < text.length) {
    const char = text[index]

    if (isEscaped) {
      nodes.push(new PlainTextNode(char))
      isEscaped = false
      index += 1
      continue
    }

    if (char === '\\') {
      isEscaped = true
      index += 1
      continue
    }

    if (index === 0 && options.startsWith) {
      if (isMatch(options.startsWith)) {
        index += options.startsWith.length
        continue
      } else {
        return new FailedParseResult()
      }
    }

    if (options.exitBefore && isMatch(options.exitBefore)) {
      return new SuccessfulParseResult(nodes, index)
    }
    
    if (options.endsWith && isMatch(options.endsWith)) {
      return new SuccessfulParseResult(nodes, index + options.endsWith.length)
    }

    for (let parser of options.parsers) {
      const result = parser(text.slice(index), parentNode)
      if (result.success()) {
        nodes.push.apply(nodes, result.nodes)
        index += result.countCharsConsumed
        continue main_parser_loop
      }
    }

    nodes.push(new PlainTextNode(char))
    index += 1
  }

  if (options.endsWith) {
    return new FailedParseResult()
  }

  return new SuccessfulParseResult(nodes, index)
}
