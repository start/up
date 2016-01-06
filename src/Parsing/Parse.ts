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

export function parse(text: string, parentNode: RichSyntaxNode, options: ParseOptions, exitBefore?: string): ParseResult {
  let nodes: SyntaxNode[] = []
  let isEscaped = false
  const parsers = options.parsers || []
  
  let index = 0

  function isMatchHere(needle: string): boolean {
    return needle === text.substr(index, needle.length)
  }
  
  if (exitBefore && isMatchHere(exitBefore)) {
    return new FailedParseResult();
  }

  if (options.startsWith) {
    if (isMatchHere(options.startsWith)) {
      index += options.startsWith.length
      } else {
      return new FailedParseResult()
    }
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
    
    if (exitBefore && isMatchHere(exitBefore)) {
      break
    }

    for (let parser of parsers) {
      const result = parser(text.slice(index), parentNode, options.endsWith)
      if (result.success()) {
        nodes.push.apply(nodes, result.nodes)
        index += result.countCharsConsumed
        continue main_parser_loop
      }
    }
    
    if (options.endsWith && isMatchHere(options.endsWith)) {
      return new SuccessfulParseResult(nodes, index + options.endsWith.length)
    }

    nodes.push(new PlainTextNode(char))
    index += 1
  }

  if (options.endsWith) {
    return new FailedParseResult()
  }

  return new SuccessfulParseResult(nodes, index)
}
