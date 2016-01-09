import { ParseResult } from './ParseResult'
import { CompletedParseResult } from './CompletedParseResult'
import { FailedParseResult } from './FailedParseResult'

import { Matcher } from '../Matching/Matcher'
import { MatchResult } from '../Matching/MatchResult'

import { InlineSandwich } from './InlineSandwich'

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

const INLINE_CODE = new InlineSandwich(InlineCodeNode, '`', '`')
const STRESS = new InlineSandwich(StressNode, '**', '**')
const EMPHASIS = new InlineSandwich(EmphasisNode, '*', '*')
const REVISION_INSERTION = new InlineSandwich(RevisionInsertionNode, '++', '++')
const REVISION_DELETION = new InlineSandwich(RevisionDeletionNode, '~~', '~~')
const SPOILER = new InlineSandwich(SpoilerNode, '[<_<]', '[>_>]')

class InlineParser {
  public result: ParseResult
  private nodes: SyntaxNode[] = []
  
  constructor(private matcher: Matcher, private parentNode: RichSyntaxNode, private mustCloseParent = true) {    
    
    main_parser_loop:
    while (!this.matcher.done()) {
      if (this.done()) {
        return
      }
      
      if (this.tryOpenOrCloseSandiwch(INLINE_CODE)) {
        continue
      }
      
      if (this.parentNode instanceof InlineCodeNode) {
        this.addPlainCharNode()
        continue 
      }
      
      for (let sandwhich of [
        STRESS, EMPHASIS, REVISION_INSERTION, REVISION_DELETION, SPOILER
      ]) {
        if (this.tryOpenOrCloseSandiwch(sandwhich)) {
          continue main_parser_loop
        }
      }
      
      this.addPlainCharNode()
    }
    
    if (this.mustCloseParent) {
      this.finish(new FailedParseResult())
      return
    }
    
    this.finish(new CompletedParseResult(this.nodes, this.matcher.countCharsAdvanced()))
  }
  
  
  tryOpenOrCloseSandiwch(sandwich: InlineSandwich): boolean {
    if (this.parentNode instanceof sandwich.NodeType) {
      const closingBunResult = this.matcher.match(sandwich.closingBun)
      
      if (closingBunResult.success()) {
        this.finish(new CompletedParseResult(this.nodes, this.matcher.countCharsAdvancedIncluding(closingBunResult)))
        return true
      }
    } else {
      const openingBunResult = this.matcher.match(sandwich.openingBun)
       
       if (openingBunResult.success()) {
         const sandwichNode = new sandwich.NodeType()
         const sandwichResult = new InlineParser(new Matcher(this.matcher, openingBunResult.matchedText), sandwichNode).result 
         
         if (sandwichResult.success()) {
           this.addParseResult(sandwichResult, sandwichNode)
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
  
  private addPlainCharNode(): void {
    const plainCharResult = this.matcher.matchAnyChar()
    this.nodes.push(new PlainTextNode(plainCharResult.matchedText))
    this.matcher.advance(plainCharResult)
  }
  
  private addParseResult(result: ParseResult, resultParentNode: RichSyntaxNode): void {
    resultParentNode.addChildren(result.nodes)
    this.nodes.push(resultParentNode)
    this.matcher.advance(result.countCharsConsumed)
  }
}