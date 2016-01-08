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
  private nodes: SyntaxNode[] = []
  
  constructor(private matcher: Matcher, private parentNode: RichSyntaxNode, private mustCloseParent = true) {    
    
    while (!this.matcher.done()) {
      if (this.done()) {
        return
      }
      
      const inlineCodeDelimiterResult = this.matcher.match('`')
      
      if (inlineCodeDelimiterResult.success()) {
        if (this.parentNode instanceof InlineCodeNode) {
          this.finish(new CompletedParseResult(this.nodes, this.matcher.countCharsAdvancedIncluding(inlineCodeDelimiterResult)))
          return
        }
        
        const inlineCodeNode = new InlineCodeNode()
        const inlineCodeResult =
          new InlineParser(new Matcher(this.matcher, inlineCodeDelimiterResult.matchedText), inlineCodeNode).result
            
        if (inlineCodeResult.success()) {
          inlineCodeNode.addChildren(inlineCodeResult.nodes)
          this.nodes.push(inlineCodeNode)
          this.matcher.advance(inlineCodeResult.countCharsConsumed)
          continue
        }        
      }
      
      const plainCharResult = this.matcher.matchAnyChar()
      this.nodes.push(new PlainTextNode(plainCharResult.matchedText))

      this.matcher.advance(plainCharResult)
    }
    
    if (this.mustCloseParent) {
      this.finish(new FailedParseResult())
      return
    }
    
    this.finish(new CompletedParseResult(this.nodes, this.matcher.countCharsAdvanced()))
  }
  
  
  tryOpenOrCloseSandiwch(SandwichNodeType: RichSyntaxNodeType, openingBun: string, closingBun: string): boolean {
    if (this.parentNode instanceof SandwichNodeType) {
      const closingBunResult = this.matcher.match(closingBun)
      
      if (closingBunResult.success()) {
        this.finish(new CompletedParseResult(this.nodes, this.matcher.countCharsAdvancedIncluding(closingBunResult)))
        return true
      }
    } else {
      const openingBunResult = this.matcher.match(openingBun)
       
       if (openingBunResult.success()) {
         const sandwichNode = new SandwichNodeType()
         const sandwichResult = new InlineParser(new Matcher(this.matcher, openingBunResult.matchedText), sandwichNode).result 
         
         if (sandwichResult.success()) {
           sandwichNode.addChildren(sandwichResult.nodes)
           this.nodes.push(sandwichNode)
           this.matcher.advance(sandwichResult.countCharsConsumed)
           
           return true
         }
       }
    }
    
    return false
  }
  
  
  private done(): boolean {
    return !!this.result
  }
  
  private finish(result: ParseResult): void {
    this.result = result
  }
  
  private fail(): void {
    this.result = new FailedParseResult()
  }
}