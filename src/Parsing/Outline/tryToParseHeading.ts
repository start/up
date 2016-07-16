import { LineConsumer } from './LineConsumer'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { OutlineParserArgs } from './OutlineParserArgs'
import { DIVIDER_STREAK_PATTERN, NON_BLANK_PATTERN } from '../Patterns'
import { getInlineNodes } from '../Inline/getInlineNodes'
import { isLineFancyOutlineConvention } from './isLineFancyOutlineConvention'
import { getSortedUnderlineChars } from './getSortedUnderlineChars'


// If text is underlined, it's treated as a heading. Headings can have an optional overline, too.
export function tryToParseHeading(args: OutlineParserArgs): boolean {
  const consumer = new LineConsumer(args.lines)

  // First, let's try to consume the optional overline...
  let optionalOverline: string

  consumer.consume({
    linePattern: DIVIDER_STREAK_PATTERN,
    then: line => {
      optionalOverline = line
    }
  })

  let rawContent: string
  let underline: string

  const hasContentAndUnderline = (
    // Now, let's consume the content...
    consumer.consume({
      linePattern: NON_BLANK_PATTERN,
      then: line => {
        rawContent = line
      }
    })

    // ... and the underline.
    && consumer.consume({
      if: line => DIVIDER_STREAK_PATTERN.test(line) && isUnderlineConsistentWithOverline(optionalOverline, line),
      then: line => {
        underline = line
      }
    })

    // We're still not convinced this is actually a heading. Why's that?
    //
    // Well, what if the content is a streak? For example:
    //
    // =============================================
    // #~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#
    // =============================================
    //
    // Or what if the content is a list with a single item? For example:
    //
    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
    // * Buy milk
    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
    //
    // Neither of those should be parsed as headings. We only accept the heading's content if it would
    // would otherwise be parsed as a regular paragraph.
    && !isLineFancyOutlineConvention(rawContent, args.config))

  if (!hasContentAndUnderline) {
    return false
  }

  const headingLevel = args.headingLeveler.registerUnderlineAndGetLevel(underline)
  const headingChildren = getInlineNodes(rawContent, args.config)

  args.then(
    [new HeadingNode(headingChildren, headingLevel)],
    consumer.countLinesConsumed)

  return true
}


function isUnderlineConsistentWithOverline(overline: string, underline: string): boolean {
  return !overline || (getSortedUnderlineChars(overline) === getSortedUnderlineChars(underline))
}
