import { LineConsumer } from './LineConsumer'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'
import { tryToParseSectionSeparatorStreak } from './tryToParseSectionSeparatorStreak'
import { tryToParseHeading } from './tryToParseHeading'
import { tryToParseBlankLineSeparation } from './tryToParseBlankLineSeparation'
import { tryToParseCodeBlock } from './tryToParseCodeBlock'
import { tryToParseBlockquote } from './tryToParseBlockquote'
import { tryToParseUnorderedList } from './tryToParseUnorderedList'
import { trytoParseOrderedList } from './tryToParseOrderedList'
import { tryToParseDescriptionList } from './tryToParseDescriptionList'
import { tryToParseSpoilerBlock } from './tryToParseSpoilerBlock'
import { parseRegularLines } from './parseRegularLines'
import { NON_BLANK_PATTERN } from '../Patterns'
import { last } from '../../CollectionHelpers'
import { HeadingLeveler } from './HeadingLeveler'
import { UpConfig } from '../../UpConfig'


const OUTLINE_CONVENTIONS = [
  tryToParseBlankLineSeparation,
  tryToParseHeading,
  tryToParseUnorderedList,
  trytoParseOrderedList,
  tryToParseSectionSeparatorStreak,
  tryToParseCodeBlock,
  tryToParseBlockquote,
  tryToParseSpoilerBlock,
  tryToParseDescriptionList
]


export function getOutlineNodes(
  lines: string[],
  headingLeveler: HeadingLeveler,
  config: UpConfig
): OutlineSyntaxNode[] {
  const consumer = new LineConsumer(withoutOuterBlankLines(lines))
  const outlineNodes: OutlineSyntaxNode[] = []

  while (!consumer.done()) {
    const outlineParserArgs = {
      lines: consumer.getRemainingLines(),
      headingLeveler,
      config,
      then: (newNodes: OutlineSyntaxNode[], countLinesConsumed: number) => {
        outlineNodes.push(...newNodes)
        consumer.skipLines(countLinesConsumed)
      }
    }

    if (!OUTLINE_CONVENTIONS.some(tryToParse => tryToParse(outlineParserArgs))) {
      parseRegularLines(outlineParserArgs)
    }
  }

  return condenseConsecutiveSectionSeparatorNodes(outlineNodes)
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


function withoutOuterBlankLines(lines: string[]): string[] {
  let firstIndexOfNonBlankLine = 0

  for (; firstIndexOfNonBlankLine < lines.length; firstIndexOfNonBlankLine++) {
    const line = lines[firstIndexOfNonBlankLine]

    if (NON_BLANK_PATTERN.test(line)) {
      break
    }
  }

  let lastIndexOfNonBlankLine = lines.length - 1

  for (; lastIndexOfNonBlankLine >= firstIndexOfNonBlankLine; lastIndexOfNonBlankLine--) {
    const line = lines[lastIndexOfNonBlankLine]

    if (NON_BLANK_PATTERN.test(line)) {
      break
    }
  }

  return lines.slice(firstIndexOfNonBlankLine, lastIndexOfNonBlankLine + 1)
}
