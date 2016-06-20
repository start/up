import { LineConsumer } from './LineConsumer'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { OutlineParser } from './OutlineParser'
import { OutlineParserArgs } from './OutlineParserArgs'
import { either } from '../../PatternHelpers'
import { DIVIDER_STREAK_PATTERN, NON_BLANK_PATTERN } from '../../Patterns'
import { getInlineNodes } from '../Inline/getInlineNodes'
import { getOutlineNodes } from './getOutlineNodes'
import { isLineFancyOutlineConvention } from './isLineFancyOutlineConvention'
import { HeadingLeveler } from './HeadingLeveler'
import { getSortedUnderlineChars } from './getSortedUnderlineChars'


// If text is underlined, it's treated as a heading. Headings can have an optional overline, too.
export function parseHeading(args: OutlineParserArgs): boolean {
  const consumer = new LineConsumer(args.text)

  // First, let's parse the optional overline.
  let optionalOverline: string

  consumer.consume({
    linePattern: DIVIDER_STREAK_PATTERN,
    then: line => { optionalOverline = line }
  })

  let rawContent: string
  let underline: string

  const hasContentAndUnderline = (
    // Parse the content
    consumer.consume({
      linePattern: NON_BLANK_PATTERN,
      then: line => { rawContent = line }
    })

    // Parse the underline
    && consumer.consume({
      if: line => (
        DIVIDER_STREAK_PATTERN.test(line)
        && isUnderlineConsistentWithOverline(optionalOverline, line)),
      then: line => { underline = line }
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

  if (isLineFancyOutlineConvention(rawContent, args.config)) {
    return false
  }

  const headingLevel = args.headingLeveler.registerUnderlineAndGetLevel(underline)

  args.then(
    [new HeadingNode(getInlineNodes(rawContent, args.config), headingLevel)],
    consumer.textIndex)

  return true
}


function isUnderlineConsistentWithOverline(overline: string, underline: string): boolean {
  return !overline || (getSortedUnderlineChars(overline) === getSortedUnderlineChars(underline))
}
