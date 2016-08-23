import { LineConsumer } from './LineConsumer'
import { ThematicBreak } from '../../SyntaxNodes/ThematicBreak'
import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'
import { SpoilerBlock } from '../../SyntaxNodes/SpoilerBlock'
import { NsfwBlock } from '../../SyntaxNodes/NsfwBlock'
import { NsflBlock } from '../../SyntaxNodes/NsflBlock'
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
import { Config } from '../../Config'
import { OutlineParserArgs } from './OutlineParserArgs'


export function getOutlineSyntaxNodes(
  args: {
    markupLines: string[],
    sourceLineNumber: number,
    headingLeveler: HeadingLeveler,
    config: Config
  }
): OutlineSyntaxNode[] {
  const { markupLines, headingLeveler, config } = args
  const { terms } = config

  const outlineConventions = [
    tryToParseBlankLineSeparation,
    tryToParseUnorderedList,
    trytoParseOrderedList,
    tryToParseHeading,
    tryToParseOutlineSeparatorStreak,
    tryToParseCodeBlock,
    tryToParseBlockquote,
    tryToParseTableOrChart,
    getLabeledBlockParser(terms.markup.spoiler, SpoilerBlock),
    getLabeledBlockParser(terms.markup.nsfw, NsfwBlock),
    getLabeledBlockParser(terms.markup.nsfl, NsflBlock),
    tryToParseDescriptionList
  ]

  const markupWithoutLeadingBlankLines =
    withoutLeadingBlankLines(markupLines)

  const countLeadingBlankLinesRemoved =
    (markupLines.length - markupWithoutLeadingBlankLines.length)

  const startingSourceLineNumber =
    args.sourceLineNumber + countLeadingBlankLinesRemoved

  const markupWithoutOuterBlankLines =
    withoutTrailingBlankLines(markupWithoutLeadingBlankLines)

  const markupLineConsumer = new LineConsumer(markupWithoutOuterBlankLines)
  const outlineNodes: OutlineSyntaxNode[] = []

  while (!markupLineConsumer.done()) {
    const sourceLineNumber =
      startingSourceLineNumber + markupLineConsumer.countLinesConsumed

    const outlineParserArgs: OutlineParserArgs = {
      markupLines: markupLineConsumer.remaining(),
      sourceLineNumber,
      headingLeveler,
      config,
      then: (newNodes, countLinesConsumed) => {
        if (config.createSourceMap) {
          for (const node of newNodes) {
            node.sourceLineNumber = sourceLineNumber
          }
        }

        outlineNodes.push(...newNodes)
        markupLineConsumer.skipLines(countLinesConsumed)
      }
    }

    if (!outlineConventions.some(tryToParse => tryToParse(outlineParserArgs))) {
      parseRegularLines(outlineParserArgs)
    }
  }

  return condenseConsecutiveOutlineSeparators(outlineNodes)
}


function withoutLeadingBlankLines(lines: string[]): string[] {
  let firstIndexOfNonBlankLine = 0

  for (; firstIndexOfNonBlankLine < lines.length; firstIndexOfNonBlankLine++) {
    const line = lines[firstIndexOfNonBlankLine]

    if (NON_BLANK_PATTERN.test(line)) {
      break
    }
  }

  return lines.slice(firstIndexOfNonBlankLine)
}

function withoutTrailingBlankLines(lines: string[]): string[] {
  let lastIndexOfNonBlankLine = lines.length - 1

  for (; lastIndexOfNonBlankLine >= 0; lastIndexOfNonBlankLine--) {
    const line = lines[lastIndexOfNonBlankLine]

    if (NON_BLANK_PATTERN.test(line)) {
      break
    }
  }

  return lines.slice(0, lastIndexOfNonBlankLine + 1)
}

// To produce a cleaner AST, we condense multiple consecutive outline separator nodes into one.
function condenseConsecutiveOutlineSeparators(nodes: OutlineSyntaxNode[]): OutlineSyntaxNode[] {
  const resultNodes: OutlineSyntaxNode[] = []

  for (let node of nodes) {
    const isConsecutiveOutlineSeparator =
      node instanceof ThematicBreak
      && last(resultNodes) instanceof ThematicBreak

    if (!isConsecutiveOutlineSeparator) {
      resultNodes.push(node)
    }
  }

  return resultNodes
}
