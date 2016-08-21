import { LineConsumer } from './LineConsumer'
import { Heading } from '../../SyntaxNodes/Heading'
import { OutlineParserArgs } from './OutlineParserArgs'
import { DIVIDER_STREAK_PATTERN, NON_BLANK_PATTERN } from '../Patterns'
import { getInlineSyntaxNodes } from '../Inline/getInlineSyntaxNodes'
import { isLineFancyOutlineConvention } from './isLineFancyOutlineConvention'
import { getSortedUnderlineChars } from './getSortedUnderlineChars'


// If text is underlined, it's treated as a heading. Headings can have an optional overline, too.
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
    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
    // * Buy milk
    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
    //
    // Neither of those should be parsed as headings. We only accept the heading's content if it would
    // would otherwise be parsed as a regular paragraph.
    && !isLineFancyOutlineConvention(contentMarkup, args.config))

  if (!hasContentAndUnderline) {
    return false
  }

  const children = getInlineSyntaxNodes(contentMarkup, args.config)
  const level = args.headingLeveler.registerUnderlineAndGetLevel(underline)

  args.then(
    [new Heading(children, { level })],
    markupLineConsumer.countLinesConsumed)

  return true
}


function isUnderlineConsistentWithOverline(overline: string, underline: string): boolean {
  return !overline || (getSortedUnderlineChars(overline) === getSortedUnderlineChars(underline))
}
