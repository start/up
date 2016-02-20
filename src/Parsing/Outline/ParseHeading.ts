import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'
import { ParseArgs, OnParse, Parser } from '../Parser'
import { streakOf, dottedStreakOf, either, NON_BLANK, STREAK } from './Patterns'
import { parseInline } from '../Inline/ParseInline'

const NON_BLANK_PATTERN = new RegExp(
  NON_BLANK
)

const STREAK_PATTERN = new RegExp(
  STREAK
)

// Underlined text is treated as a heading. Headings can have an optional overline, too.
export function parseHeading(text: string, parseArgs: ParseArgs, onParse: OnParse): boolean {
  const consumer = new TextConsumer(text)

  // First, let's consume the optional overline.
  let overlineChars: string
  consumer.consumeLineIf(STREAK_PATTERN, (overline) => overlineChars = getDistinctStreakChars(overline))
  
  // Next, let's consume the content.
  let content: string
  if (!consumer.consumeLineIf(NON_BLANK_PATTERN, (contentLine) => content = contentLine)) {
    return false
  }
   
  // The content must not be a streak! Why not? Take a look:
  //
  // #~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~
  // ===***===***===***===***===***===***===***===*
  // #~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~
  //
  // The author almost certainly intended those lines to serve as a section separator,
  // not as a heading.
  //
  // This wouldn't be necessary if we could simply parse separator streaks before headings, but we can't.
  // That's because the separator streak parser would also consume a heading's overline.
  if (STREAK_PATTERN.test(content)) {
    return false
  }
  
  // Finally, we consume the underline.
  let underlineChars: string
  if (!consumer.consumeLineIf(STREAK_PATTERN, (underline) => underlineChars = getDistinctStreakChars(underline))) {
    return false
  }
      
  // If there is an overline, it must consist of the same chars as the underline.
  if (overlineChars && (overlineChars !== underlineChars)) {
    return false
  }

  parseInline(content, { parentNode: new HeadingNode(parseArgs.parentNode, 1) },
    (inlineNodes, countCharsParsed, headingNode) => {
      headingNode.addChildren(inlineNodes)
      onParse([headingNode], consumer.countCharsAdvanced(), parseArgs.parentNode)
    })

  return true
}

function getDistinctStreakChars(streak: string): string {
  const allStreakChars = streak.trim().split('')

  const distinctUnderlineChars =
    allStreakChars
      .reduce((distinctChars, char) => {
        const haveAlreadySeenChar = distinctChars.some((distinctChar) => distinctChar === char)
        return (
          haveAlreadySeenChar
            ? distinctChars
            : distinctChars.concat([char]))
      }, [])

  return distinctUnderlineChars.sort().join('')
}