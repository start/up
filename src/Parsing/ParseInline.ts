import { ParseResult } from './ParseResult'
import { CompletedParseResult } from './CompletedParseResult'
import { FailedParseResult } from './FailedParseResult'

import { TextMatcher } from '../Matching/TextMatcher'
import { TextMatchResult } from '../Matching/TextMatchResult'

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
import { InlineAsideNode } from '../SyntaxNodes/InlineAsideNode'

import { LinkParser } from './LinkParser'

export function parseInline(text: string, parentNode: RichSyntaxNode, terminateOn: string = null): ParseResult {
  return new InlineParser(new TextMatcher(text), parentNode, terminateOn, false).result
}

const INLINE_CODE = new InlineSandwich(InlineCodeNode, '`', '`')
const STRESS = new InlineSandwich(StressNode, '**', '**')
const EMPHASIS = new InlineSandwich(EmphasisNode, '*', '*')
const REVISION_INSERTION = new InlineSandwich(RevisionInsertionNode, '++', '++')
const REVISION_DELETION = new InlineSandwich(RevisionDeletionNode, '~~', '~~')
const SPOILER = new InlineSandwich(SpoilerNode, '[<_<]', '[>_>]')
const INLINE_ASIDE = new InlineSandwich(InlineAsideNode, '((', '))')


class InlineParser {
  
  public result: ParseResult;
  private nodes: SyntaxNode[] = [];

  constructor(private matcher: TextMatcher, private parentNode: RichSyntaxNode, private terminateOn: string = null, private mustCloseParent = true) {

    main_parser_loop:
    while (!this.matcher.done()) {
      if (this.result) {
        return
      }

      if (this.tryOpenOrCloseSandiwch(INLINE_CODE)) {
        continue
      }

      if (this.parentNode instanceof InlineCodeNode) {
        this.addPlainCharNode()
        continue
      }

      if (this.terminatedEarly()) {
        break
      }

      if (this.tryParseLink()) {
        continue
      }

      for (let sandwhich of [
        STRESS, EMPHASIS, REVISION_INSERTION, REVISION_DELETION, SPOILER, INLINE_ASIDE
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


  private tryParseLink(): boolean {
    const linkResult = new LinkParser(new TextMatcher(this.matcher), this.parentNode).result

    if (linkResult.success()) {
      this.incorporateResultIfSuccessful(linkResult)
      return true
    }
    
    return false
  }


  tryOpenOrCloseSandiwch(sandwich: InlineSandwich): boolean {
    if (this.parentNode instanceof sandwich.NodeType) {
      const closingBunResult = this.matcher.match(sandwich.closingBun)

      if (closingBunResult.success()) {
        this.finish(new CompletedParseResult(this.nodes, this.matcher.countCharsAdvancedIncluding(closingBunResult)))
        return true
      }
    }
    
    const openingBunResult = this.matcher.match(sandwich.openingBun)

    if (openingBunResult.success()) {
      const sandwichNode = new sandwich.NodeType()
      const sandwichResult = new InlineParser(new TextMatcher(this.matcher, openingBunResult.matchedText), sandwichNode, this.terminateOn).result

      if (this.incorporateResultIfSuccessful(sandwichResult, sandwichNode)) {
        return true
      }
    }

    return false
  }


  private finish(result: ParseResult): void {
    this.result = result
  }


  private fail(): void {
    this.result = new FailedParseResult()
  }


  private addPlainCharNode(): void {
    this.nodes.push(new PlainTextNode(this.matcher.currentChar()))
    this.matcher.advance()
  }


  private incorporateResultIfSuccessful(result: ParseResult, resultParentNode?: RichSyntaxNode): boolean {
    if (result.success()) {
      this.incporporateResult(result, resultParentNode)
      return true
    }

    return false
  }


  private incporporateResult(result: ParseResult, resultParentNode?: RichSyntaxNode): void {
    if (resultParentNode) {
      resultParentNode.addChildren(result.nodes)
      this.nodes.push(resultParentNode)
    } else {
      this.nodes.push.apply(this.nodes, result.nodes)
    }

    this.matcher.advanceBy(result.countCharsConsumed)
  }


  private terminatedEarly(): boolean {
    if (this.terminateOn) {
      const terminatorResult = this.matcher.match(this.terminateOn)

      if (terminatorResult.success()) {
        this.matcher.advanceBy(terminatorResult)
        return true
      }

      return false
    }
  }
}