import { DIVIDER_STREAK_PATTERN, NON_BLANK_PATTERN } from '../../Patterns'
import { Heading } from '../../SyntaxNodes/Heading'
import { getInlineSyntaxNodes } from '../Inline/getInlineSyntaxNodes'
import { isUnderlineConsistentWithOverline } from './HeadingLeveler'
import { isLineFancyOutlineConvention } from './isLineFancyOutlineConvention'
import { LineConsumer } from './LineConsumer'
import { OutlineParserArgs } from './OutlineParserArgs'
import { OutlineParseResult } from './OutlineParseResult'


// If text is underlined, it's treated as a heading.
//
// The first heading in a document is always a top-level heading. All subsequent headings
// with underlines consisting of the same characters are considered top-level.
//
// The first heading with a different combination of underline characters is considered a
// second-level heading. Unsurprisingly, all subsequent headings with underlines consisting
// of the same characters are also considered second-level.
//
// This process continues ad infinitum. There is no limit to the number of heading levels
// in a document.
//
// A heading can have an optional "overline", but its overline must consist of the same
// combination of characters as its underline.
//
// For the purpose of determining heading levels, a heading with an overline is always
// considered distinct from a heading without one, even if both headings use the same
// combination of underline characters. Therefore, a heading with an overline will never
// have the same level as a heading without an overline.
export function tryToParseHeading(args: OutlineParserArgs): OutlineParseResult {
  const markupLineConsumer = new LineConsumer(args.markupLines)

  // First, let's try to consume the optional overline...
  const overlineResult =
    markupLineConsumer.consumeLineIfMatches(DIVIDER_STREAK_PATTERN)

  const optionalOverline = overlineResult
    ? overlineResult.line
    : null

  // Next, the heading's content...
  const contentResult =
    markupLineConsumer.consumeLineIfMatches(NON_BLANK_PATTERN)

  if (!contentResult) {
    return null
  }

  const contentMarkup = contentResult.line

  /// And finally its underline!
  const underlineResult =
    markupLineConsumer.consumeLineIfMatches(DIVIDER_STREAK_PATTERN)

  if (!underlineResult) {
    return null
  }

  const underline = underlineResult.line

  if (!isUnderlineConsistentWithOverline(optionalOverline, underline)) {
    return null
  }

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
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // * Buy milk
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //
  // Neither of those should be parsed as headings. We only accept the heading's content if it would
  // would otherwise be parsed as a regular paragraph.
  if (isLineFancyOutlineConvention(contentMarkup, args.settings)) {
    return null
  }

  const children =
    getInlineSyntaxNodes(contentMarkup, args.settings)

  const level =
    args.headingLeveler.registerHeadingAndGetLevel(underline, optionalOverline)

  return {
    parsedNodes: [new Heading(children, { level, titleMarkup: contentMarkup.trim() })],
    countLinesConsumed: markupLineConsumer.countLinesConsumed
  }
}
