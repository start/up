import { TextConsumer } from '../TextConsumer'
import { OrderedListNode, ListOrder } from '../../SyntaxNodes/OrderedListNode'
import { OrderedListItem } from '../../SyntaxNodes/OrderedListItem'
import { getOutlineNodes } from './GetOutlineNodes'
import { optional, startsWith, either, capture, INLINE_WHITESPACE_CHAR, BLANK, INDENT, INTEGER, STREAK } from './Patterns'
import { last } from '../CollectionHelpers'


const BULLETED_PATTERN = new RegExp(
  startsWith(
    optional(' ')
    + either(
      '#',
      capture(either(INTEGER, '#') + either('\\.', '\\)'))
    )
    + INLINE_WHITESPACE_CHAR
  )
)

const INTEGER_FOLLOWED_BY_PERIOD_PATTERN = new RegExp(
  INTEGER + '\\.'
)

const STREAK_PATTERN = new RegExp(
  STREAK
)

const BLANK_PATTERN = new RegExp(
  BLANK
)

const INDENTED_PATTERN = new RegExp(
  startsWith(INDENT)
)

enum ReasonIndentedBlockEnded {
  EndOfText,
  NonIndentedLine,
  TwoBlankLines,
  ThreeOrMoreBlankLines
}

interface Args {
  text: string,
  then: OnSuccess
}

interface OnSuccess {
  (block: string, lengthParsed: number, reasonEnded: ReasonIndentedBlockEnded): void
}


export function parseIndentedBlock(args: Args): boolean {
  const consumer = new TextConsumer(args.text)
  const lines: string[] = []
  let terminator = ReasonIndentedBlockEnded.EndOfText

  while (!consumer.done()) {
    const wasLineConsumed = consumer.consumeLine({
      if: (line) => BLANK_PATTERN.test(line) || INDENTED_PATTERN.test(line)
    })

    if (!wasLineConsumed) {
      break
    }
  }

  if (!consumer.lengthConsumed()) {
    return false
  }

  args.then(lines.join('\n'), consumer.lengthConsumed(), terminator)
  return true
}
