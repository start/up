import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { HeadingNodeWithUndeterminedLevel } from '../../SyntaxNodes/HeadingNodeWithUndeterminedLevel'
import { ParseArgs, OnParse, Parser } from '../Parser'
import { streakOf, dottedStreakOf, either, NON_BLANK, STREAK } from './Patterns'
import { parseInline } from '../Inline/ParseInline'

const NON_BLANK_LINE_PATTERN = new RegExp(
  NON_BLANK
)

const STREAK_PATTERN = new RegExp(
  STREAK
)

// Underlined text is treated as a heading. Headings can have an optional overline, too.
export function parseHeading(text: string, parseArgs: ParseArgs, onParse: OnParse): boolean {
  const consumer = new TextConsumer(text)

  let overlineChars: string

  // First, let's consume the optional overline.
  consumer.consumeLineIf(STREAK_PATTERN,
    (overline) => overlineChars = getDistinctStreakChars(overline))

  let content: string
  let underlineChars: string
  
  // Now, let's consume the content and the required underline. The content itself must
  // not be a streak. Why? Take a look:
  //
  // =~=~=~=~=~=~=~=~=~=~=~=
  // # # # # # # # # # # # #
  //
  // The author almost certainly intended those lines to serve as a section separator,
  // not as a heading.
  const hasContentAndUnderline = (
    consumer.consumeLineIf(NON_BLANK_LINE_PATTERN,
      (contentLine) => content = contentLine)
      
    && !STREAK_PATTERN.test(content)
    
    && consumer.consumeLineIf(STREAK_PATTERN,
      (underline) => underlineChars = getDistinctStreakChars(underline))
  )

  //  If there is an overline, it must consist of the same chars as the underline.
  const doesOverlineMatchUnderline =
    !overlineChars || (overlineChars === underlineChars)

  if (!hasContentAndUnderline || !doesOverlineMatchUnderline) {
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