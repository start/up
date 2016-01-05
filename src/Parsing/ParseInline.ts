import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { ParseResult } from './ParseResult'

export function parseInline(text: string, parentNode: SyntaxNode): ParseResult {
  if (!text) {
    return new ParseResult([], 0)
  }
  
  return new ParseResult(
    [new PlainTextNode(escape(text))],
    text.length
  )
}

function escape(text: string): string {
  let result = ''
  let isEscaped = false
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    
    if (isEscaped || char !== '\\') {
      result += char
      isEscaped = false
      continue
    }
    
    if (char === '\\') {
      isEscaped = true
    }
  }
  
  return result
}