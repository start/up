import { ParseResult } from './ParseResult'
import { CompletedParseResult } from './CompletedParseResult'
import { FailedParseResult } from './FailedParseResult'

import { Matcher } from '../Matching/Matcher'
import { MatchResult } from '../Matching/MatchResult'

import { RichSyntaxNodeType } from '../SyntaxNodes/RichSyntaxNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'
import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'

import { LinkNode } from '../SyntaxNodes/LinkNode'

import { parseInline } from './parseInline'

export class LinkParser {
  public result: ParseResult

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

    const linkNode = new LinkNode()

    const contentResult = parseInline(this.matcher.remaining(), linkNode, ' -> ')

    if (!contentResult.success()) {
      this.fail()
      return
    }

    this.matcher.advance(contentResult.countCharsConsumed)
    linkNode.addChildren(contentResult.nodes)

    let url = ''

    while (!this.matcher.done()) {
      const closeBrackerResult = this.matcher.match(']')

      if (closeBrackerResult.success()) {
        linkNode.url = url
        this.finish(new CompletedParseResult([linkNode], this.matcher.countCharsAdvancedIncluding(closeBrackerResult)))
      }

      const plainCharResult = this.matcher.matchAnyChar()
      url += plainCharResult.matchedText
      this.matcher.advance(plainCharResult)
    }

    this.fail()
  }



  private finish(result: ParseResult): void {
    this.result = result
  }


  private fail(): void {
    this.result = new FailedParseResult()
  }
}