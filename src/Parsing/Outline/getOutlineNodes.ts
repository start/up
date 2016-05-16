import { LineConsumer } from './LineConsumer'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'
import { parseSectionSeparatorStreak } from './parseSectionSeparatorStreak'
import { getHeadingParser } from './getHeadingParser'
import { parseBlankLineSeparation } from './parseBlankLineSeparation'
import { parseRegularLines } from './parseRegularLines'
import { parseCodeBlock } from './parseCodeBlock'
import { parseBlockquote } from './parseBlockquote'
import { parseUnorderedList } from './parseUnorderedList'
import { parseOrderedList } from './parseOrderedList'
import { parseDescriptionList } from './parseDescriptionList'
import { startsWith, endsWith, BLANK, ANY_WHITESPACE, LINE_BREAK } from '../Patterns'
import { last } from '../../CollectionHelpers'
import { HeadingLeveler } from './HeadingLeveler'
import { UpConfig } from '../../UpConfig'


export function getOutlineNodes(
  text: string,
  headingLeveler: HeadingLeveler,
  config: UpConfig
): OutlineSyntaxNode[] {
  
  const outlineParsers = [
    parseBlankLineSeparation,
    getHeadingParser(headingLeveler),
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
          headingLeveler: headingLeveler,
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
  startsWith(ANY_WHITESPACE + LINE_BREAK))

const TRAILIN_BLANK_LINES_PATTERN = new RegExp(
  endsWith(LINE_BREAK + ANY_WHITESPACE))


function trimOuterBlankLines(text: string): string {
  return (
    text
      .replace(LEADING_BLANK_LINES_PATTERN, '')
      .replace(TRAILIN_BLANK_LINES_PATTERN, ''))
}
