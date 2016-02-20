import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { HeadingNodeWithUndeterminedLevel } from '../../SyntaxNodes/HeadingNodeWithUndeterminedLevel'
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
  consumer.consumeLineIf(NON_BLANK_PATTERN, (contentLine) => content = contentLine)
    
  // The content must not be a streak! Why not? Take a look:
  //
  // #~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#
  // ===============================================
  // #~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#
  //
  // The author almost certainly intended those lines to serve as a section separator,
  // not as a heading.
  if (!content || STREAK_PATTERN.test(content)) {
    return false
  }
  
  // Finally, we consume the underline
  let underlineChars: string
  consumer.consumeLineIf(STREAK_PATTERN,
    (underline) => underlineChars = getDistinctStreakChars(underline))

  if (!underlineChars) {
    return false
  }
      
  //  If there was an overline, it must consist of the same chars as the underline.
  if (!overlineChars || (overlineChars === underlineChars)) {
    return false
  }

  parseInline(content, { parentNode: new HeadingNodeWithUndeterminedLevel(parseArgs.parentNode) },
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