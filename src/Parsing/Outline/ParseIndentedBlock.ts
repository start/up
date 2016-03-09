import { TextConsumer } from '../TextConsumer'
import { OrderedListNode, ListOrder } from '../../SyntaxNodes/OrderedListNode'
import { OrderedListItem } from '../../SyntaxNodes/OrderedListItem'
import { getOutlineNodes } from './GetOutlineNodes'
import { optional, startsWith, either, capture, INLINE_WHITESPACE_CHAR, BLANK, INDENT, INTEGER, STREAK } from './Patterns'
import { last } from '../CollectionHelpers'
import { OutlineParser, OutlineParserArgs, } from './OutlineParser'


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

const BLANK_LINE_PATTERN = new RegExp(
  BLANK
)

const INDENTED_PATTERN = new RegExp(
  startsWith(INDENT)
)

enum IndentedBlockTerminator {
  ReachedEndOfText,
  NonIndentedLine,
  MinorSeparation,
  SectionSeparation
}

interface Args {
  text: string,
  then: OnSuccess
}

interface OnSuccess {
  (block: string, lengthParsed: number, ender: IndentedBlockTerminator): void
}


export function parseIndentedBlock(args: Args): boolean {
  const consumer = new TextConsumer(args.text)
  const lines: string[] = []
  let terminator = IndentedBlockTerminator.ReachedEndOfText
  
  while (!consumer.done()) {
      const isLineBlank = consumer.consumeLine({
        pattern: BLANK_LINE_PATTERN,
        then: (line) => lines.push(line)
      })

      if (!isLineBlank) {
        // Well, the line was neither indented nor blank. That means it's either the start of
        // another list item, or it's the first line following the list. Let's leave this inner
        // loop and find out which.
        break
      }
      
      const isLineIndented = consumer.consumeLine({
        pattern: INDENTED_PATTERN,
        then: (line) => lines.push(line.replace(INDENTED_PATTERN, ''))
      })

      if (isLineIndented) {
        continue
      }
    }
    
    if (!consumer.lengthConsumed()) {
      return false
    }
    
    args.then(lines.join('\n'), consumer.lengthConsumed(), terminator)
    return true
}
