import { ParseResult } from './../ParseResult'
import { FailedParseResult } from './../FailedParseResult'
import { parseInline } from './ParseInline'

import { TextConsumer } from '../../TextConsumption/TextConsumer'

import { RichSyntaxNode } from '../../SyntaxNodes/RichSyntaxNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'

export class LinkParser {

  public result: ParseResult;
  private linkNode = new LinkNode();
  private consumer: TextConsumer;

  constructor(text: string, private parentNode: RichSyntaxNode) {
    this.consumer = new TextConsumer(text)
    
    if (this.parentNode.orAnyAncestor(ancestor => ancestor instanceof LinkNode)) {
      this.fail()
      return
    }

    if (!this.tryParseOpenBracketOrFail()) {
      return
    }

    if (!this.tryParseContentPlusArrowOrFail()) {
      return
    }

    if (!this.tryParseUrlPlusClosingBracketOrFail()) {
      return
    }
    
    this.finish(new ParseResult([this.linkNode], this.consumer.countCharsAdvanced()))
  }


  private tryParseOpenBracketOrFail(): boolean {
    if (this.consumer.consumeIf('[')) {
      return true
    }

    this.fail()
    return false
  }


  private tryParseContentPlusArrowOrFail(): boolean {
    const contentResult = parseInline(this.consumer.remaining(), this.linkNode, ' -> ')

    if (!contentResult.success) {
      this.fail()
      return false
    }

    this.consumer.skip(contentResult.countCharsParsed)
    this.linkNode.addChildren(contentResult.nodes)

    return true
  }


  private tryParseUrlPlusClosingBracketOrFail(): boolean {
    let url = ''

    while (!this.consumer.done()) {
      if (this.consumer.consumeIf(']', () => { this.linkNode.url = url })) {
        return true
      }

      url += this.consumer.currentChar()
      this.consumer.moveNext()
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