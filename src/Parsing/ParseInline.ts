import { ParseResult } from './ParseResult'
import { CompletedParseResult } from './CompletedParseResult'
import { FailedParseResult } from './FailedParseResult'

import { Matcher } from '../Matching/Matcher'
import { MatchResult } from '../Matching/MatchResult'

import { RichSyntaxNodeType } from '../SyntaxNodes/RichSyntaxNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'
import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'

import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'
import { InlineCodeNode } from '../SyntaxNodes/InlineCodeNode'
import { EmphasisNode } from '../SyntaxNodes/EmphasisNode'
import { StressNode } from '../SyntaxNodes/StressNode'
import { RevisionDeletionNode } from '../SyntaxNodes/RevisionDeletionNode'
import { RevisionInsertionNode } from '../SyntaxNodes/RevisionInsertionNode'
import { SpoilerNode } from '../SyntaxNodes/SpoilerNode'

export function parseInline(text: string, parentNode: RichSyntaxNode): ParseResult {
  return new InlineParser(new Matcher(text), parentNode).result
}

class InlineParser {
  public result: ParseResult
  
  constructor(private matcher: Matcher, private parentNode: RichSyntaxNode) {
    const nodes: SyntaxNode[] = [] 
    
    while (!matcher.done()) {
      const result = matcher.matchAnyChar()
      nodes.push(new PlainTextNode(result.matchedText))
      
      matcher.advance(result)
    }
    
    this.result = new CompletedParseResult(nodes, matcher.index)
  }
}