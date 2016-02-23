import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { parseInline } from '../Inline/ParseInline'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { TextConsumer } from '../TextConsumer'
import { parseSectionSeparatorStreak } from './ParseSectionSeparatorStreak'
import { getHeadingParser } from './GetHeadingParser'
import { parseBlankLineSeparation } from './ParseBlankLineSeparation'
import { parseLineBlock } from './ParseLineBlock'
import { parseCodeBlock } from './ParseCodeBlock'
import { parseBlockquote } from './ParseBlockquote'
import { parseBulletedList } from './ParseBulletedList'
import { parseParagraph } from './ParseParagraph'
import { ParseContext, OnParse } from '../Parser'
import { startsWith, endsWith, BLANK, ANY_WHITESPACE} from './Patterns'
import { last } from '../CollectionHelpers'
import { HeadingLeveler, isUnderlineConsistentWithOverline} from './HeadingLeveler'

const TRAILING_WHITESPACE_PATTERN = new RegExp(
  endsWith(ANY_WHITESPACE)
)

const LEADING_BLANK_LINES_PATTERN = new RegExp(
  startsWith(ANY_WHITESPACE + '\n')
)

// Why doesn't the getOutlineNodes function accept a callback like all the other parsers?
//
// Well, that callback is helpful when:
//
// 1. The parser might fail
// 2. The parser might consume an unknown number of characters 
//
// The getOutlineNodes satisfies neither criteria: It will always successfully parses the entire string.
// It's simpler simply to return the result nodes.
//
// Furthermore, getOutlineNodes doesn't accept a parentNode parameter, because the parent node never
// matters when parsing any outline nodes.
export function getOutlineNodes(text: string): SyntaxNode[] {
  
  // Within each call to parseOutline, we reset the underlines associated with each heading level. 
  // This means blockquotes and list items are their own mini-documents with their own heading
  // outline structures. This behavior is subject to change.
  const headingParser =  getHeadingParser(new HeadingLeveler())

  const outlineParsers = [
    parseBlankLineSeparation,
    parseBulletedList,
    headingParser,
    parseSectionSeparatorStreak,
    parseCodeBlock,
    parseBlockquote,
    parseLineBlock,
    parseParagraph
  ]

  // Leading and trailing blank lines are ignored. This also trims trailing whitespace from the
  // last non-blank line, but that won't affect parsing.
  const trimmedText = text
    .replace(LEADING_BLANK_LINES_PATTERN, '')
    .replace(TRAILING_WHITESPACE_PATTERN, '')
    
  const consumer = new TextConsumer(trimmedText)
  const nodes: SyntaxNode[] = []

  main_parser_loop:
  while (!consumer.done()) {
    const remainingText = consumer.remainingText()

    for (let parser of outlineParsers) {
      const parsedSuccessfully =
        parser(remainingText, {},
          (resultNodes, lengthParsed) => {
            nodes.push(...resultNodes)
            consumer.skip(lengthParsed)
          })

      if (parsedSuccessfully) {
        continue main_parser_loop
      }
    }

    throw new Error(`Unrecognized outline convention. Remaining text: ${remainingText}`)
  }

  return withoutExtraConsecutiveSeparatorNodes(nodes)
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