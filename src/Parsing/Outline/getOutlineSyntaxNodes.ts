import { last } from '../../CollectionHelpers'
import { NormalizedSettings } from '../../NormalizedSettings'
import { NON_BLANK_PATTERN } from '../../Patterns'
import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'
import { ThematicBreak } from '../../SyntaxNodes/ThematicBreak'
import { HeadingLeveler } from './HeadingLeveler'
import { LineConsumer } from './LineConsumer'
import { OutlineParserArgs } from './OutlineParserArgs'
import { OutlineParseResult } from './OutlineParseResult'
import { parseParagraphOrLineBlock } from './parseParagraphOrLineBlock'
import { tryToParseBlankLineSeparation } from './tryToParseBlankLineSeparation'
import { tryToParseBlockquote } from './tryToParseBlockquote'
import { tryToParseBulletedList } from './tryToParseBulletedList'
import { tryToParseCodeBlock } from './tryToParseCodeBlock'
import { tryToParseDescriptionList } from './tryToParseDescriptionList'
import { tryToParseHeading } from './tryToParseHeading'
import { tryToParseNumberedList } from './tryToParseNumberedList'
import { tryToParseRevealableBlock } from './tryToParseRevealableBlock'
import { tryToParseTable } from './tryToParseTable'
import { tryToParseThematicBreakStreak } from './tryToParseThematicBreakStreak'



// This includes every outline convention.
const OUTLINE_CONVENTION_PARSERS = [
  tryToParseBlankLineSeparation,
  tryToParseBulletedList,
  tryToParseNumberedList,
  tryToParseHeading,
  tryToParseThematicBreakStreak,
  tryToParseCodeBlock,
  tryToParseBlockquote,
  tryToParseTable,
  tryToParseRevealableBlock,
  tryToParseDescriptionList,
  parseParagraphOrLineBlock
]


export function getOutlineSyntaxNodes(
  args: {
    markupLines: string[],
    sourceLineNumber: number,
    headingLeveler: HeadingLeveler,
    settings: NormalizedSettings.Parsing
  }
): OutlineSyntaxNode[] {
  const { markupLines, headingLeveler, settings } = args

  const markupWithoutLeadingBlankLines =
    withoutLeadingBlankLines(markupLines)

  const countLeadingBlankLinesRemoved =
    (markupLines.length - markupWithoutLeadingBlankLines.length)

  const initialSourceLineNumber =
    args.sourceLineNumber + countLeadingBlankLinesRemoved

  const markupWithoutOuterBlankLines =
    withoutTrailingBlankLines(markupWithoutLeadingBlankLines)

  const markupLineConsumer = new LineConsumer(markupWithoutOuterBlankLines)
  const nodes: OutlineSyntaxNode[] = []

  while (!markupLineConsumer.done) {
    const sourceLineNumber =
      initialSourceLineNumber + markupLineConsumer.countLinesConsumed

    const outlineParserArgs: OutlineParserArgs = {
      markupLines: markupLineConsumer.remaining(),
      sourceLineNumber,
      headingLeveler,
      settings
    }

    for (const parse of OUTLINE_CONVENTION_PARSERS) {
      const result: OutlineParseResult = parse(outlineParserArgs)

      if (result) {
        if (settings.createSourceMap) {
          for (const node of result.parsedNodes) {
            node.sourceLineNumber = sourceLineNumber
          }
        }

        nodes.push(...result.parsedNodes)
        markupLineConsumer.skipLines(result.countLinesConsumed)

        break
      }
    }

    if (!OUTLINE_CONVENTION_PARSERS.some(tryToParse => tryToParse(outlineParserArgs))) {
      parseParagraphOrLineBlock(outlineParserArgs)
    }
  }

  return condenseConsecutiveThematicBreaks(nodes)
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

// To produce a cleaner document, we condense multiple consecutive thematic breaks into one.
function condenseConsecutiveThematicBreaks(nodes: OutlineSyntaxNode[]): OutlineSyntaxNode[] {
  const resultNodes: OutlineSyntaxNode[] = []

  for (const node of nodes) {
    const isConsecutiveThematicBreak =
      node instanceof ThematicBreak
      && last(resultNodes) instanceof ThematicBreak

    if (!isConsecutiveThematicBreak) {
      resultNodes.push(node)
    }
  }

  return resultNodes
}
