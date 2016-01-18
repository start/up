import { ParseResult } from './../ParseResult'
import { FailedParseResult } from './../FailedParseResult'

import { TextConsumer } from '../../TextConsumption/TextConsumer'

import { RichSyntaxNodeType } from '../../SyntaxNodes/RichSyntaxNode'
import { RichSyntaxNode } from '../../SyntaxNodes/RichSyntaxNode'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'

import { LinkNode } from '../../SyntaxNodes/LinkNode'

import { parseInline } from './parseInline'


export class LinkParser {

  public result: ParseResult;
  private linkNode = new LinkNode();

  constructor(private consumer: TextConsumer, private parentNode: RichSyntaxNode) {
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
    
    this.finish(new ParseResult([this.linkNode], consumer.countCharsAdvanced()))
  }


  private tryParseOpenBracketOrFail(): boolean {
    if (this.consumer.consume('[')) {
      return true
    }

    this.fail()
    return false
  }


  private tryParseContentOrFail(): boolean {
    const contentResult = parseInline(this.consumer.remaining(), this.linkNode, ' -> ')

    if (!contentResult.success()) {
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

      if (this.consumer.consume(']', (reject, consumer) => {
        this.linkNode.url = url
      })) {
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