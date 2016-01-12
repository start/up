import { ParagraphNode } from '../SyntaxNodes/ParagraphNode'
import { ParseResult } from './ParseResult'
import { parseInline } from './ParseInline'

import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'

import { TextMatcher } from '../Matching/TextMatcher'
import { TextMatchResult } from '../Matching/TextMatchResult'

export function parseOutline(text: string): ParseResult {
  let nodes: SyntaxNode[] = []
  
  const matcher = new TextMatcher(text)

  while (!matcher.done()) {
    var lineResult = matcher.line()
    
    if (/^\s+$/.test(lineResult.text)) {
      matcher.advanceBy(lineResult)
      continue
    }
    
    const paragraphNode = new ParagraphNode()
    paragraphNode.addChildren(parseInline(lineResult.text, paragraphNode).nodes)
    nodes.push(paragraphNode)
    matcher.advanceBy(lineResult)
  }

  return new ParseResult(nodes, text.length)
}