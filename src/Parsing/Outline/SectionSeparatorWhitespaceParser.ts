import { ParseResult } from './../ParseResult'
import { FailedParseResult } from './../FailedParseResult'
import { parseInline } from '../Inline/ParseInline'

import { TextConsumer } from '../../TextConsumption/TextConsumer'

import { RichSyntaxNode } from '../../SyntaxNodes/RichSyntaxNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'

export class SectionSeparatorWhitespaceParser {

  public result: ParseResult;
  private linkNode = new SectionSeparatorNode();

  constructor(text: string, private parentNode: RichSyntaxNode) {
    const consumer = new TextConsumer(text)
    
    const blankLine = /^\s*$/
    const countBlankLinesInSeparator = 3
    
    for (let i = 0; i < countBlankLinesInSeparator; i++) {
      if (!consumer.consumeLineIf(blankLine)) {
        this.result = new FailedParseResult()
        return
      }
    }
    
    this.result = new ParseResult([new SectionSeparatorNode()], consumer.countCharsAdvanced())
  }
}