import { LineConsumer } from './LineConsumer'
import { ThematicBreak } from '../../SyntaxNodes/ThematicBreak'
import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'
import { tryToParseThematicBreakStreak } from './tryToParseThematicBreakStreak'
import { tryToParseHeading } from './tryToParseHeading'
import { tryToParseBlankLineSeparation } from './tryToParseBlankLineSeparation'
import { tryToParseCodeBlock } from './tryToParseCodeBlock'
import { tryToParseBlockquote } from './tryToParseBlockquote'
import { tryToParseBulletedList } from './tryToParseBulletedList'
import { trytoParseNumberedList } from './trytoParseNumberedList'
import { tryToParseDescriptionList } from './tryToParseDescriptionList'
import { tryToParseTable } from './tryToParseTable'
import { tryToParseRevealableBlock } from './tryToParseRevealableBlock'
import { parseParagraphOrLineBlock } from './parseParagraphOrLineBlock'
import { NON_BLANK_PATTERN } from '../../Patterns'
import { last } from '../../CollectionHelpers'
import { HeadingLeveler } from './HeadingLeveler'
import { NormalizedSettings } from '../../NormalizedSettings'
import { OutlineParserArgs } from './OutlineParserArgs'



// This includes every outline convention except paragraphs and line blocks.
//
// Paragraphs and line blocks serve as a last resort if none of these conventions apply.
const OUTLINE_CONVENTION_PARSERS = [
  tryToParseBlankLineSeparation,
  tryToParseBulletedList,
  trytoParseNumberedList,
  tryToParseHeading,
  tryToParseThematicBreakStreak,
  tryToParseCodeBlock,
  tryToParseBlockquote,
  tryToParseTable,
  tryToParseRevealableBlock,
  tryToParseDescriptionList
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

  while (!markupLineConsumer.done()) {
    const sourceLineNumber =
      initialSourceLineNumber + markupLineConsumer.countLinesConsumed

    const outlineParserArgs: OutlineParserArgs = {
      markupLines: markupLineConsumer.remaining(),
      sourceLineNumber,
      headingLeveler,
      settings,
      then: (parsedNodes, countLinesConsumed) => {
        if (settings.createSourceMap) {
          for (const node of parsedNodes) {
            node.sourceLineNumber = sourceLineNumber
          }
        }

        nodes.push(...parsedNodes)
        markupLineConsumer.skipLines(countLinesConsumed)
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

  for (let node of nodes) {
    const isConsecutiveThematicBreak =
      node instanceof ThematicBreak
      && last(resultNodes) instanceof ThematicBreak

    if (!isConsecutiveThematicBreak) {
      resultNodes.push(node)
    }
  }

  return resultNodes
}
