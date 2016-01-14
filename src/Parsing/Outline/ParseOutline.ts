import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { ParseResult } from '.././ParseResult'
import { parseInline } from '../Inline/ParseInline'

import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'

import { LineMatcher } from '../../Matching/LineMatcher'
import { TextMatchResult } from '../../Matching/TextMatchResult'

export function parseOutline(text: string): ParseResult {
  let nodes: SyntaxNode[] = []
  
  const matcher = new LineMatcher(text)

  while (!matcher.done()) {
    if (matcher.matchLine(/^\s*$/, (match) => { matcher.advanceBy(match) })) {
      continue;
    }
    
    matcher.line((match) => {
      const paragraphNode = new ParagraphNode()
      paragraphNode.addChildren(parseInline(match.text, paragraphNode).nodes)
      
      nodes.push(paragraphNode)
      matcher.advanceBy(match)
    })
  }

  return new ParseResult(nodes, text.length)
}