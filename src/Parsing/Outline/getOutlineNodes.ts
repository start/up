import { LineConsumer } from './LineConsumer'
import { OutlineSeparatorNode } from '../../SyntaxNodes/OutlineSeparatorNode'
import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'
import { SpoilerBlockNode } from '../../SyntaxNodes/SpoilerBlockNode'
import { NsfwBlockNode } from '../../SyntaxNodes/NsfwBlockNode'
import { NsflBlockNode } from '../../SyntaxNodes/NsflBlockNode'
import { tryToParseOutlineSeparatorStreak } from './tryToParseOutlineSeparatorStreak'
import { tryToParseHeading } from './tryToParseHeading'
import { tryToParseBlankLineSeparation } from './tryToParseBlankLineSeparation'
import { tryToParseCodeBlock } from './tryToParseCodeBlock'
import { tryToParseBlockquote } from './tryToParseBlockquote'
import { tryToParseUnorderedList } from './tryToParseUnorderedList'
import { trytoParseOrderedList } from './tryToParseOrderedList'
import { tryToParseDescriptionList } from './tryToParseDescriptionList'
import { tryToParseTableOrChart } from './tryToParseTableOrChart'
import { getLabeledBlockParser } from './getLabeledBlockParser'
import { parseRegularLines } from './parseRegularLines'
import { NON_BLANK_PATTERN } from '../Patterns'
import { last } from '../../CollectionHelpers'
import { HeadingLeveler } from './HeadingLeveler'
import { UpConfig } from '../../UpConfig'


export function getOutlineNodes(
  markupLines: string[],
  headingLeveler: HeadingLeveler,
  config: UpConfig
): OutlineSyntaxNode[] {
  const { terms } = config.settings.i18n

  const outlineConventions = [
    tryToParseBlankLineSeparation,
    tryToParseUnorderedList,
    trytoParseOrderedList,
    tryToParseHeading,
    tryToParseOutlineSeparatorStreak,
    tryToParseCodeBlock,
    tryToParseBlockquote,
    tryToParseTableOrChart,
    getLabeledBlockParser(terms.spoiler, SpoilerBlockNode),
    getLabeledBlockParser(terms.nsfw, NsfwBlockNode),
    getLabeledBlockParser(terms.nsfl, NsflBlockNode),
    tryToParseDescriptionList
  ]

  const markupLineConsumer = new LineConsumer(withoutOuterBlankLines(markupLines))
  const outlineNodes: OutlineSyntaxNode[] = []

  while (!markupLineConsumer.done()) {
    const outlineParserArgs = {
      markupLines: markupLineConsumer.remaining(),
      headingLeveler,
      config,
      then: (newNodes: OutlineSyntaxNode[], countLinesConsumed: number) => {
        outlineNodes.push(...newNodes)
        markupLineConsumer.skipLines(countLinesConsumed)
      }
    }

    if (!outlineConventions.some(tryToParse => tryToParse(outlineParserArgs))) {
      parseRegularLines(outlineParserArgs)
    }
  }

  return condenseConsecutiveOutlineSeparatorNodes(outlineNodes)
}


// To produce a cleaner AST, we condense multiple consecutive outline separator nodes into one.
function condenseConsecutiveOutlineSeparatorNodes(nodes: OutlineSyntaxNode[]): OutlineSyntaxNode[] {
  const resultNodes: OutlineSyntaxNode[] = []

  for (let node of nodes) {
    const isConsecutiveOutlineSeparatorNode =
      node instanceof OutlineSeparatorNode
      && last(resultNodes) instanceof OutlineSeparatorNode

    if (!isConsecutiveOutlineSeparatorNode) {
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
