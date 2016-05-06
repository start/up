import { LineConsumer } from './LineConsumer'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { OutlineParser, OutlineParserArgs } from './OutlineParser'
import { either, NON_BLANK, STREAK } from '../Patterns'
import { getInlineNodes } from '../Inline/GetInlineNodes'
import { getOutlineNodes } from './GetOutlineNodes'
import { isLineFancyOutlineConvention } from './IsLineFancyOutlineConvention'
import { HeadingLeveler, isUnderlineConsistentWithOverline} from './HeadingLeveler'

const NON_BLANK_PATTERN = new RegExp(
  NON_BLANK
)

const STREAK_PATTERN = new RegExp(
  STREAK
)

// Underlined text is treated as a heading. Headings can have an optional overline, too.
export function getHeadingParser(headingLeveler: HeadingLeveler): OutlineParser {

  return function parseHeading(args: OutlineParserArgs): boolean {
    const consumer = new LineConsumer(args.text)

    // First, let's parse the optional overline.
    let optionalOverline: string

    consumer.consumeLine({
      pattern: STREAK_PATTERN,
      then: (line) => optionalOverline = line
    })

    // Next, save the content and parse the underline.
    let content: string
    let underline: string

    const hasContentAndUnderline = (
      // Parse the content
      consumer.consumeLine({
        pattern: NON_BLANK_PATTERN,
        then: (line) => content = line
      })

      // Parse the underline
      && consumer.consumeLine({
        if: (line) => (
          STREAK_PATTERN.test(line)
          && isUnderlineConsistentWithOverline(optionalOverline, line)),
        then: (line) => underline = line
      })
    )

    if (!hasContentAndUnderline) {
      return false
    }


    // We're still not convinced this is actually a heading. Why's that?
    //
    // What if the content is a streak? Example:
    //
    // =============================================
    // #~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#
    // =============================================
    //
    // Or what if the content is a list with a single item? Example:
    //
    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
    // * Buy milk
    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
    //
    // Neither of those should be parsed as headings. We only accept the heading's content if it would
    // would otherwise be parsed as a regular paragraph.

    if (isLineFancyOutlineConvention(content, args.config)) {
      return false
    }

    const headingLevel = headingLeveler.registerUnderlineAndGetLevel(underline)
    
    args.then(
      [new HeadingNode(getInlineNodes(content, args.config), headingLevel)],
      consumer.lengthConsumed())

    return true
  }
}
