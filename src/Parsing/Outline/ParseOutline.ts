import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { parseInline } from '../Inline/ParseInline'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { TextConsumer } from '../TextConsumer'
import { parseSectionSeparatorStreak } from './ParseSectionSeparatorStreak'
import { parseHeading } from './ParseHeading'
import { parseBlankLineSeparation } from './ParseBlankLineSeparation'
import { parseLineBlock } from './ParseLineBlock'
import { parseCodeBlock } from './ParseCodeBlock'
import { parseBlockquote } from './ParseBlockquote'
import { parseBulletedList } from './ParseBulletedList'
import { parseParagraph } from './ParseParagraph'
import { ParseArgs, OnParse } from '../Parser'
import { startsWith, endsWith, streakOf, dottedStreakOf, BLANK, ANY_WHITESPACE} from './Patterns'
import { last } from '../CollectionHelpers'

const outlineParsers = [
  parseBlankLineSeparation,
  parseBulletedList,
  parseHeading,
  parseSectionSeparatorStreak,
  parseCodeBlock,
  parseBlockquote,
  parseLineBlock,
  parseParagraph
]

const TRAILING_WHITESPACE_PATTERN = new RegExp(
  endsWith(ANY_WHITESPACE)
)

const LEADING_BLANK_LINES_PATTERN = new RegExp(
  startsWith(ANY_WHITESPACE + '\n')
)

export function parseOutline(text: string, parseArgs: ParseArgs, onParse: OnParse): boolean {
  // Leading and trailing blank lines are ignored. This also trims trailing whitespace from the
  // last non-blank line, but that won't affect parsing.
  const trimmedText = text
    .replace(LEADING_BLANK_LINES_PATTERN, '')
    .replace(TRAILING_WHITESPACE_PATTERN, '')

  const countCharsTrimmed = text.length - trimmedText.length
  
  const nodes: SyntaxNode[] = []
  const consumer = new TextConsumer(trimmedText)

  main_parser_loop:
  while (!consumer.done()) {
    const remainingText = consumer.remainingText()

    for (let parser of outlineParsers) {
      const parsedSuccessfully =
        parser(remainingText, parseArgs,
          (parsedNodes, countCharsParsed) => {
            nodes.push.apply(nodes, parsedNodes)
            consumer.skip(countCharsParsed)
          })

      if (parsedSuccessfully) {
        continue main_parser_loop
      }
    }

    throw new Error(`Unrecognized outline convention. Remaining text: ${remainingText}`)
  }
  

  onParse(
    withoutExtraConsecutiveSeparatorNodes(nodes),
    countCharsTrimmed + consumer.countCharsConsumed(),
    parseArgs.parentNode)
    
  return true
}

function withoutExtraConsecutiveSeparatorNodes(nodes: SyntaxNode[]): SyntaxNode[] {
  const resultNodes: SyntaxNode[] = []
  
  for (let node of nodes) {
    const isExtraConsecutiveSectionSeparatorNode =
      node instanceof SectionSeparatorNode
      && last(resultNodes) instanceof SectionSeparatorNode
      
    if (!isExtraConsecutiveSectionSeparatorNode) {
      resultNodes.push(node)
    }
  }
  
  return resultNodes
}