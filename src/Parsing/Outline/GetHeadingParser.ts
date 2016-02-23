import { TextConsumer } from '../TextConsumer'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { ParseContext, OnParse, Parser } from '../Parser'
import { either, NON_BLANK, STREAK } from './Patterns'
import { parseInline } from '../Inline/ParseInline'
import { HeadingLeveler, isUnderlineConsistentWithOverline} from './HeadingLeveler'

const NON_BLANK_PATTERN = new RegExp(
  NON_BLANK
)

const STREAK_PATTERN = new RegExp(
  STREAK
)

// Underlined text is treated as a heading. Headings can have an optional overline, too.
export function getHeadingParser(headingLeveler: HeadingLeveler): Parser {
  
  return function parseHeading(text: string, parseArgs: ParseContext, onParse: OnParse): boolean {
    const consumer = new TextConsumer(text)

    // First, let's parse the optional overline.
    let optionalOverline: string

    consumer.consumeLineIfMatches({
      pattern: STREAK_PATTERN,
      then: (line) => optionalOverline = line
    })
  
    // Next, let's parse the content and underline.
    //
    // The content must not be a streak! Why not? Take a look:
    //
    // =============================================
    // #~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#
    // =============================================
    //
    // The author almost certainly included those lines to separate sections, not as a heading.
    //
    // We wouldn't need to care about this if we could parse separator streaks before headings,
    // but that would introduce its own complications: The separator streak parser would always
    // want to consume every heading's overline.
    let content: string
    let underline: string

    const hasContentAndUnderline = (
      // Parse the content
      consumer.consumeLine({
        if: (line) => NON_BLANK_PATTERN.test(line) && !STREAK_PATTERN.test(line),
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

    const headingLevel = headingLeveler.registerUnderlineAndGetLevel(underline)

    parseInline(content, { parentNode: new HeadingNode(parseArgs.parentNode, headingLevel) },
      (inlineNodes, countCharsParsed, headingNode) => {
        headingNode.addChildren(inlineNodes)
        onParse([headingNode], consumer.lengthConsumed(), parseArgs.parentNode)
      })

    return true
  }
}
