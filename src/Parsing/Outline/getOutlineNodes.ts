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
import { parseRegularLines } from './parseRegularLines'
import { regExpStartingWith, regExpEndingWith } from '../PatternHelpers'
import { ANY_WHITESPACE } from '../PatternPieces'
import { INPUT_LINE_BREAK } from '../Strings'
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
  tryToParseDescriptionList
]


export function getOutlineNodes(
  text: string,
  headingLeveler: HeadingLeveler,
  config: UpConfig
): OutlineSyntaxNode[] {

  const consumer = new LineConsumer(trimOuterBlankLines(text))
  const outlineNodes: OutlineSyntaxNode[] = []

  while (!consumer.reachedEndOfText()) {
    const outlineParserArgs = {
      text: consumer.remainingText,
      headingLeveler,
      config,
      then: (newNodes: OutlineSyntaxNode[], lengthParsed: number) => {
        outlineNodes.push(...newNodes)
        consumer.advanceTextIndex(lengthParsed)
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


function trimOuterBlankLines(text: string): string {
  return text
    .replace(LEADING_BLANK_LINES_PATTERN, '')
    .replace(TRAILIN_BLANK_LINES_PATTERN, '')
}


const LEADING_BLANK_LINES_PATTERN =
  regExpStartingWith(ANY_WHITESPACE + INPUT_LINE_BREAK)

const TRAILIN_BLANK_LINES_PATTERN =
  regExpEndingWith(INPUT_LINE_BREAK + ANY_WHITESPACE)
