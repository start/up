import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { ParseArgs, OnParse, Parser } from '../Parser'
import { streakOf, dottedStreakOf, either, NON_BLANK_LINE } from './Patterns'
import { parseInline } from '../Inline/ParseInline'

// Underlined text is considered a heading. Headings can have an optional overline, too.
export function getHeadingParser(underlinePattern: string, level: number): Parser {
  let underlineOrOverline = new RegExp(underlinePattern)

  return function parseHeading(text: string, parseArgs: ParseArgs, onParse: OnParse): boolean {
    const consumer = new TextConsumer(text)

    // Parse optional overline
    consumer.consumeLineIf(underlineOrOverline)

    const headingNode = new HeadingNode(parseArgs.parentNode, level)
    let content: string

    const hasContentAndOverline =
      consumer.consumeLineIf(NON_BLANK_LINE,
        (line) => {
          content = line
        })
      && consumer.consumeLineIf(underlineOrOverline)

    return hasContentAndOverline
      && parseInline(content, { parentNode: headingNode }, (inlineNodes) => {
        headingNode.addChildren(inlineNodes)
        onParse([headingNode], consumer.countCharsAdvanced(), parseArgs.parentNode)
      })
  }
}
