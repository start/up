import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { ParseArgs, OnParse, Parser } from '../Parser'
import { NON_BLANK } from './Patterns'
import { parseInline } from '../Inline/ParseInline'

const NON_BLANK_LINE_PATTERN = new RegExp(
  NON_BLANK
) 

// Underlined text is treated as a heading. Headings can have an optional overline, too.
export function getHeadingParser(underlinePattern: string, level: number): Parser {
  let underlineOrOverline = new RegExp(underlinePattern)

  return function parseHeading(text: string, parseArgs: ParseArgs, onParse: OnParse): boolean {
    const consumer = new TextConsumer(text)

    // Parse optional overline
    consumer.consumeLineIf(underlineOrOverline)

    let content: string

    const hasContentAndUnderline =
      consumer.consumeLineIf(NON_BLANK_LINE_PATTERN,
        (line) => {
          content = line
        })
      && consumer.consumeLineIf(underlineOrOverline)

    return (
      hasContentAndUnderline
      // The heading's content should never fail to parse
      && parseInline(content, { parentNode: new HeadingNode(parseArgs.parentNode, level) },
        (inlineNodes, countCharsParsed, headingNode) => {
          headingNode.addChildren(inlineNodes)
          onParse([headingNode], consumer.countCharsAdvanced(), parseArgs.parentNode)
        })
    )
  }
}
