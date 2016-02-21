import { TextConsumer } from '../TextConsumer'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { ParseArgs, OnParse, Parser } from '../Parser'
import { streakOf, dottedStreakOf, either, NON_BLANK, STREAK } from './Patterns'
import { parseInline } from '../Inline/ParseInline'
import { HeadingLeveler } from './HeadingLeveler'

const NON_BLANK_PATTERN = new RegExp(
  NON_BLANK
)

const STREAK_PATTERN = new RegExp(
  STREAK
)

// Underlined text is treated as a heading. Headings can have an optional overline, too.
export function parseHeading(text: string, parseArgs: ParseArgs, onParse: OnParse): boolean {
    
  // TODO: Provide as an argument!
  const headingLeveler = new HeadingLeveler()

  const consumer = new TextConsumer(text)

  // First, let's consume the optional overline.
  let overline: string

  consumer.consumeLineIfMatches({
    pattern: STREAK_PATTERN,
    then: (line) => overline = line
  })
  
  // Next, let's consume the content and underline.
  //
  // The content must not be a streak! Why not? Take a look:
  //
  // =============================================
  // #~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#
  // =============================================
  //
  // The author almost certainly intended those lines to serve as a section separator,
  // not as a heading.
  //
  // This wouldn't be necessary if we could parse separator streaks before headings, but we can't.
  // That's because the separator streak parser would always consume a heading's overline.
  let content: string
  let underline: string
  
  const hasContentAndUnderline = 
  consumer.consumeLine({
    if: (line) => NON_BLANK_PATTERN.test(line) && !STREAK_PATTERN.test(line),
    then: (line) => content = line
  })
    && consumer.consumeLineIfMatches({
      pattern: STREAK_PATTERN,
      then: (line) => underline = line
    })

  if (!hasContentAndUnderline) {
    return false
  }
  
  // The overline must not conflict with the underline.
  if (headingLeveler.doesOverlineConflictWithUnderline(underline, overline)) {
    return false
  }

  const headingLevel = headingLeveler.registerAndGetLevel(underline)

  parseInline(content, { parentNode: new HeadingNode(parseArgs.parentNode, headingLevel) },
    (inlineNodes, countCharsParsed, headingNode) => {
      headingNode.addChildren(inlineNodes)
      onParse([headingNode], consumer.countCharsConsumed(), parseArgs.parentNode)
    })

  return true
}
