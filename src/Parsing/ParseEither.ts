import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { ParseResult } from './ParseResult'
import { Parser } from './Parser'

export function parseEither(text: string, parsers: Parser[], parentNode: RichSyntaxNode): ParseResult {
  let nodes: SyntaxNode[] = []
  let isEscaped = false

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

    nodes.push(new PlainTextNode(char))
  }

  return new ParseResult(nodes, text.length)
}

