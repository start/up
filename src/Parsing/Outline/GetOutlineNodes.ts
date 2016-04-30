import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { MediaSyntaxNode } from '../../SyntaxNodes/MediaSyntaxNode'
import { LineConsumer } from './LineConsumer'
import { parseSectionSeparatorStreak } from './ParseSectionSeparatorStreak'
import { getHeadingParser } from './GetHeadingParser'
import { parseBlankLineSeparation } from './ParseBlankLineSeparation'
import { parseRegularLines } from './ParseRegularLines'
import { parseCodeBlock } from './ParseCodeBlock'
import { parseBlockquote } from './ParseBlockquote'
import { parseUnorderedList } from './ParseUnorderedList'
import { parseOrderedList } from './ParseOrderedList'
import { parseDescriptionList } from './ParseDescriptionList'
import { startsWith, endsWith, BLANK, ANY_WHITESPACE, LINE_BREAK } from './Patterns'
import { last } from '../CollectionHelpers'
import { HeadingLeveler, isUnderlineConsistentWithOverline} from './HeadingLeveler'
import { UpConfig } from '../../UpConfig'


export function getOutlineNodes(text: string, config: UpConfig): OutlineSyntaxNode[] {

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
    parseRegularLines,
  ]

  const consumer = new LineConsumer(trimOuterBlankLines(text))
  const nodes: OutlineSyntaxNode[] = []

  while (!consumer.done()) {
    for (let parseOutlineConvention of outlineParsers) {

      const wasConventionFound =
        parseOutlineConvention({
          text: consumer.remainingText(),
          config: config,
          then: (newNodes, lengthParsed) => {
            nodes.push(...newNodes)
            consumer.advance(lengthParsed)
          }
        })

      if (wasConventionFound) {
        break
      }
    }
  }

  return condenseConsecutiveSectionSeparatorNodes(nodes)
}


// To produce a cleaner AST, we condense multiple consecutive section separator nodes into one.
function condenseConsecutiveSectionSeparatorNodes(nodes: OutlineSyntaxNode[]): OutlineSyntaxNode[] {
  const resultNodes: OutlineSyntaxNode[] = []

  for (let node of nodes) {
    const isConsecutiveSectionSeparatorNode = (
      node instanceof SectionSeparatorNode
      && last(resultNodes) instanceof SectionSeparatorNode
    )

    if (!isConsecutiveSectionSeparatorNode) {
      resultNodes.push(node)
    }
  }

  return resultNodes
}


const LEADING_BLANK_LINES_PATTERN = new RegExp(
  startsWith(ANY_WHITESPACE + LINE_BREAK)
)

const TRAILIN_BLANK_LINES_PATTERN = new RegExp(
  endsWith(LINE_BREAK + ANY_WHITESPACE)
)

function trimOuterBlankLines(text: string): string {
  return (
    text
      .replace(LEADING_BLANK_LINES_PATTERN, '')
      .replace(TRAILIN_BLANK_LINES_PATTERN, '')
  )
}
