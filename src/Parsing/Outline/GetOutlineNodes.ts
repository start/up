import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'
import { TextConsumer } from '../TextConsumer'
import { parseSectionSeparatorStreak } from './ParseSectionSeparatorStreak'
import { getHeadingParser } from './GetHeadingParser'
import { parseBlankLineSeparation } from './ParseBlankLineSeparation'
import { parseLineBlock } from './ParseLineBlock'
import { parseCodeBlock } from './ParseCodeBlock'
import { parseBlockquote } from './ParseBlockquote'
import { parseUnorderedList } from './ParseUnorderedList'
import { parseOrderedList } from './ParseOrderedList'
import { parseDescriptionList } from './ParseDescriptionList'
import { parseParagraph } from './ParseParagraph'
import { startsWith, endsWith, BLANK, ANY_WHITESPACE} from './Patterns'
import { last } from '../CollectionHelpers'
import { HeadingLeveler, isUnderlineConsistentWithOverline} from './HeadingLeveler'

const LEADING_BLANK_LINES_PATTERN = new RegExp(
  startsWith(ANY_WHITESPACE + '\n')
)

const TRAILING_WHITESPACE_PATTERN = new RegExp(
  endsWith(ANY_WHITESPACE)
)


export function getOutlineNodes(text: string): OutlineSyntaxNode[] {
  
  // Within each call to parseOutline, we reset the underlines associated with each heading level. 
  // This means blockquotes and list items are their own mini-documents with their own heading
  // outline structures. This behavior is subject to change.
  const headingParser = getHeadingParser(new HeadingLeveler())

  const outlineParsers = [
    parseBlankLineSeparation,
    headingParser,
    parseUnorderedList,
    parseOrderedList,
    parseSectionSeparatorStreak,
    parseCodeBlock,
    parseBlockquote,
    parseDescriptionList,
    parseLineBlock,
    parseParagraph
  ]

  // Leading and trailing blank lines are ignored. This also trims trailing whitespace from the
  // last non-blank line, but that won't affect parsing.
  const trimmedText = text
    .replace(LEADING_BLANK_LINES_PATTERN, '')
    .replace(TRAILING_WHITESPACE_PATTERN, '')

  const consumer = new TextConsumer(trimmedText)
  const nodes: OutlineSyntaxNode[] = []

  while (!consumer.done()) {
    for (let parseOutlineConvention of outlineParsers) {

      const didConventionParseSuccessfully = parseOutlineConvention({
        text: consumer.remainingText(),
        then: (resultNodes, lengthParsed) => {
          nodes.push(...resultNodes)
          consumer.skip(lengthParsed)
        }
      })

      if (didConventionParseSuccessfully) {
        break
      }
    }
  }

  return withoutExtraConsecutiveSeparatorNodes(nodes)
}

function withoutExtraConsecutiveSeparatorNodes(nodes: OutlineSyntaxNode[]): OutlineSyntaxNode[] {
  const resultNodes: OutlineSyntaxNode[] = []

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