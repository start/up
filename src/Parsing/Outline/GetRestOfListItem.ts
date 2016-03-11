import { TextConsumer } from '../TextConsumer'
import { OrderedListNode, ListOrder } from '../../SyntaxNodes/OrderedListNode'
import { OrderedListItem } from '../../SyntaxNodes/OrderedListItem'
import { getOutlineNodes } from './GetOutlineNodes'
import { optional, startsWith, either, capture, INLINE_WHITESPACE_CHAR, BLANK, INDENT, INTEGER, STREAK } from './Patterns'
import { last } from '../CollectionHelpers'

const STREAK_PATTERN = new RegExp(
  STREAK
)

const BLANK_PATTERN = new RegExp(
  BLANK
)

const INDENTED_PATTERN = new RegExp(
  startsWith(INDENT)
)
interface Args {
  text: string,
  then: OnSuccess
}

interface OnSuccess {
  (block: string, lengthParsed: number, didListTerminate: boolean): void
}

export function getRestOfListItem(args: Args): boolean {
  const consumer = new TextConsumer(args.text)
  const lines: string[] = []
  
  let countLinesToInclude = 0
  let lengthParsed = 0

  while (!consumer.done()) {
    const wasLineBlank = consumer.consumeLine({
      pattern: BLANK_PATTERN,
      then: (line) => lines.push(line.replace(INDENTED_PATTERN, ''))
    })
    
    if (wasLineBlank) {
      // The line was blank, so we don't know whether we should include it yet.  
      continue
    }
    
    const wasLineIndented = consumer.consumeLine({
      pattern: INDENTED_PATTERN,
      then: (line) => lines.push(line.replace(INDENTED_PATTERN, ''))
    })
    
    if (wasLineIndented) {
      // The line was both non-blank and indented, so we know we need to include this line.
      countLinesToInclude = lines.length
      lengthParsed = consumer.lengthConsumed()
      continue
    } else {
      // The line was neither blank nor indented. Bail!
      break
    }
  }

  if (!lines.length) {
    return false
  }
  
  const countLinesOfTrailingWhitespace = lines.length - countLinesToInclude
  const didListTerminate = countLinesOfTrailingWhitespace >= 2
  
  args.then(lines.join('\n'), consumer.lengthConsumed(), didListTerminate)
  return true
}
