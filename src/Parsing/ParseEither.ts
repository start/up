import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { ParseResult } from './ParseResult'
import { Parser } from './Parser'

export function parseEither(text: string, parentNode: RichSyntaxNode, parsers: Parser[]): ParseResult {
  let nodes: SyntaxNode[] = []
  let isEscaped = false

  main_parser_loop:
  for (let i = 0; i < text.length; i++) {
    const char = text[i]

    if (isEscaped || char !== '\\') {
      nodes.push(new PlainTextNode(char))
      isEscaped = false
      continue
    }

    if (char === '\\') {
      isEscaped = true
      continue
    }
    
    for (let parser of parsers) {
      const result = parser(text, parentNode)
      if (result.success) {
        nodes.push.apply(nodes, result.nodes)
        continue main_parser_loop
      }
    }

    nodes.push(new PlainTextNode(char))
  }

  return new ParseResult(nodes, text.length)
}

