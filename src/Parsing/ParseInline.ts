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
  return new InlineParser(new Matcher(text), parentNode, false).result
}

class InlineParser {
  public result: ParseResult
  
  constructor(private matcher: Matcher, private parentNode: RichSyntaxNode, private mustCloseParent = true) {
    this.result = this.getResult()
  }
  
  
  private getResult(): ParseResult {
    const nodes: SyntaxNode[] = [] 
    
    while (!this.matcher.done()) {
      
      const inlineCodeDelimeterResult = this.matcher.match('`')
      
      if (inlineCodeDelimeterResult.success()) {
        console.log(this)
        if (this.parentNode instanceof InlineCodeNode) {
          return new CompletedParseResult(nodes, this.matcher.countCharsAdvancedIncluding(inlineCodeDelimeterResult))
        }
        
        const inlineCodeNode = new InlineCodeNode()
        const inlineCodeResult =
          new InlineParser(
            new Matcher(this.matcher, inlineCodeDelimeterResult.matchedText),
            inlineCodeNode).result
            
        if (inlineCodeResult.success()) {
          inlineCodeNode.addChildren(inlineCodeResult.nodes)
          nodes.push(inlineCodeNode)
          this.matcher.advance(inlineCodeResult.countCharsConsumed)
          continue
        }
        
      }
      
      const plainCharResult = this.matcher.matchAnyChar()
      nodes.push(new PlainTextNode(plainCharResult.matchedText))
      
      this.matcher.advance(plainCharResult)
    }
    
    if (this.mustCloseParent) {
      return new FailedParseResult()
    }
    
    return new CompletedParseResult(nodes, this.matcher.countCharsAdvanced())
  }
}