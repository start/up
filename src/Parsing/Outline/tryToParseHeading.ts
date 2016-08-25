import { LineConsumer } from './LineConsumer'
import { Heading } from '../../SyntaxNodes/Heading'
import { OutlineParserArgs } from './OutlineParserArgs'
import { DIVIDER_STREAK_PATTERN, NON_BLANK_PATTERN } from '../Patterns'
import { getInlineSyntaxNodes } from '../Inline/getInlineSyntaxNodes'
import { isLineFancyOutlineConvention } from './isLineFancyOutlineConvention'
import { isUnderlineConsistentWithOverline } from './HeadingLeveler'


// If text is underlined, it's treated as a heading.
//
// The first heading in a document is always a top-level heading. All subsequent headings
// with underlines consisting of the same characters are considered top-level.
//
// The first heading with a different combination of underline characters is considered a
// second-level heading. Unsurprisingly, all subsequent headings with underlines consisting
// of the same characters are also considered second-level.
//
// This process continues eternally. There is no limit to the number of heading levels in
// a document.
//
// Headings can have an optional overline, too, but the overline must consist of the same
// characters as its underline!
//
// For the purposes of determining heading levels, a heading with an overline is always
// considered distinct from a heading without one, even if both headings use the same
// combination of underline characters.
//
// Therefore, a heading with an overline will never have the same level as a heading
// without an overline.
export function tryToParseHeading(args: OutlineParserArgs): boolean {
  const markupLineConsumer = new LineConsumer(args.markupLines)

  // First, let's try to consume the optional overline...
  let optionalOverline: string

  markupLineConsumer.consume({
    linePattern: DIVIDER_STREAK_PATTERN,
    thenBeforeConsumingLine: line => {
      optionalOverline = line
    }
  })

  let contentMarkup: string
  let underline: string

  const hasContentAndUnderline = (
    // Now, let's consume the content...
    markupLineConsumer.consume({
      linePattern: NON_BLANK_PATTERN,
      thenBeforeConsumingLine: line => {
        contentMarkup = line
      }
    })

    // ... and the underline.
    && markupLineConsumer.consume({
      if: line => DIVIDER_STREAK_PATTERN.test(line) && isUnderlineConsistentWithOverline(optionalOverline, line),
      thenBeforeConsumingLine: line => {
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
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // * Buy milk
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    //
    // Neither of those should be parsed as headings. We only accept the heading's content if it would
    // would otherwise be parsed as a regular paragraph.
    && !isLineFancyOutlineConvention(contentMarkup, args.config))

  if (!hasContentAndUnderline) {
    return false
  }

  const children = getInlineSyntaxNodes(contentMarkup, args.config)
  const level = args.headingLeveler.registerUnderlineAndGetLevel(underline, optionalOverline)

  args.then(
    [new Heading(children, { level })],
    markupLineConsumer.countLinesConsumed)

  return true
}
