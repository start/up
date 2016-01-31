import { ParseResult } from './../ParseResult'
import { FailedParseResult } from './../FailedParseResult'
import { parseInline } from '../Inline/ParseInline'

import { TextConsumer } from '../../TextConsumption/TextConsumer'

import { HeadingNode } from '../../SyntaxNodes/HeadingNode'

export enum UnderlineType {
  Solid,
  Dotted
}
/*
export class HeadingParser {

  public result: ParseResult;
  private headingNode = new HeadingNode();

  constructor(private consumer: TextConsumer) {

    this.parseOptionalOverline()

    if (!this.tryParseContentOrFail()) {
      return
    }

    if (!this.tryParseUnderlineOrFail()) {
      return
    }
    
    this.finish(new ParseResult([this.headingNode], consumer.countCharsAdvanced()))
  }


  private parseOptionalOverline(): void {
    if (this.consumer.consume('[')) {
    }
  }


  private tryParseContentOrFail(): boolean {
    const contentResult = parseInline(this.consumer.remaining(), this.headingNode, ' -> ')

    if (!contentResult.success()) {
      this.fail()
      return false
    }

    this.consumer.skip(contentResult.countCharsParsed)
    this.headingNode.addChildren(contentResult.nodes)

    return true
  }


  private tryParseUnderlineOrFail(): boolean {
    let url = ''

    while (!this.consumer.done()) {
      if (this.consumer.consume(']', () => { this.headingNode.url = url })) {
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

*/