import { ParseResult } from './../ParseResult'
import { FailedParseResult } from './../FailedParseResult'

import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { ConsumedTextResult } from '../../TextConsumption/ConsumedTextResult'

import { RichSyntaxNodeType } from '../../SyntaxNodes/RichSyntaxNode'
import { RichSyntaxNode } from '../../SyntaxNodes/RichSyntaxNode'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'

import { LinkNode } from '../../SyntaxNodes/LinkNode'

import { parseInline } from './parseInline'


export class LinkParser {

  public result: ParseResult;
  private linkNode = new LinkNode();

  constructor(private matcher: TextConsumer, private parentNode: RichSyntaxNode) {
    if (this.parentNode.orAnyAncestor(ancestor => ancestor instanceof LinkNode)) {
      this.fail()
      return
    }

    if (!this.tryParseOpenBracketOrFail()) {
      return
    }

    if (!this.tryParseContentOrFail()) {
      return
    }

    this.tryParseUrlPlusClosingBracketOrFail()
  }


  private tryParseOpenBracketOrFail(): boolean {
    if (!this.matcher.consume('[')) {
      return true
    }
    
    this.fail()
    return false
  }


  private tryParseContentOrFail(): boolean {
    const contentResult = parseInline(this.matcher.remaining(), this.linkNode, ' -> ')

    if (!contentResult.success()) {
      this.fail()
      return false
    }

    this.matcher.advanceBy(contentResult.countCharsConsumed)
    this.linkNode.addChildren(contentResult.nodes)

    return true
  }


  private tryParseUrlPlusClosingBracketOrFail(): boolean {
    let url = ''

    while (!this.matcher.done()) {
      
      if (this.matcher.consume(']', (match) => {
        this.linkNode.url = url
        this.finish(new ParseResult([this.linkNode], this.matcher.countCharsAdvancedIncluding(match)))
      })) {
        return true
      }

      url += this.matcher.currentChar()
      this.matcher.advance()
    }

    this.fail()
    return false
  }


  private finish(result: ParseResult): void {
    this.result = result
  }


  private fail(): void {
    this.result = new FailedParseResult()
  }
}