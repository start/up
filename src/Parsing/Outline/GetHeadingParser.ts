import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { ParseArgs, OnParse, Parser } from '../Parser'
import { streakOf, dottedStreakOf, either, NON_BLANK } from './Patterns'
import { parseInline } from '../Inline/ParseInline'

const NON_BLANK_LINE_PATTERN = new RegExp(
  NON_BLANK
)

const STREAK_PATTERN = new RegExp(
  either(
    streakOf('-'),
    streakOf('='),
    streakOf('#'),
    dottedStreakOf('-'),
    dottedStreakOf('='),
    dottedStreakOf('#')
  )
)

// Underlined text is treated as a heading. Headings can have an optional overline, too.
export function getHeadingParser(underlinePattern: string, level: number): Parser {
  let underlineOrOverline = new RegExp(underlinePattern)

  return function parseHeading(text: string, parseArgs: ParseArgs, onParse: OnParse): boolean {
    const consumer = new TextConsumer(text)

    // First, let's consume the optional overline
    consumer.consumeLineIf(underlineOrOverline)

    let content: string

    // Now, let's consume the content and the required underline. The content itself must
    // not be a streak. Why? Take a look:
    //
    // -----------------------
    // -----------------------
    //
    // And...
    //
    // =======================
    // # # # # # # # # # # # #
    //
    // The author almost certainly intended those lines to serve as a section separator,
    // not as a heading.
    const hasContentAndUnderline =
      consumer.consumeLineIf(NON_BLANK_LINE_PATTERN, (line) => content = line)
      && !STREAK_PATTERN.test(content)
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
