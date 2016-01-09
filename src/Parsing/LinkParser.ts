import { ParseResult } from './ParseResult'
import { CompletedParseResult } from './CompletedParseResult'
import { FailedParseResult } from './FailedParseResult'

import { Matcher } from '../Matching/Matcher'
import { MatchResult } from '../Matching/MatchResult'

import { RichSyntaxNodeType } from '../SyntaxNodes/RichSyntaxNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'
import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'

import { LinkNode } from '../SyntaxNodes/LinkNode'

export class LinkParser {
  private result: ParseResult
  
  constructor(private matcher: Matcher, private parentNode: RichSyntaxNode) {
    if (this.parentNode.andAllAncestors().some(ancestor => ancestor instanceof LinkNode)) {
      this.fail()
      return
    }
    const openBracketResult = this.matcher.match('[') 
    
    if (!openBracketResult.success()) {
      this.fail()
      return
    }
    
    this.matcher.advance(openBracketResult)
    
    
  }
  
  

  private finish(result: ParseResult): void {
    this.result = result
  }


  private fail(): void {
    this.result = new FailedParseResult()
  }
}