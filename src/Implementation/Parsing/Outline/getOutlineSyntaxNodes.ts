import { last } from '../../CollectionHelpers'
import { NON_BLANK_PATTERN } from '../../Patterns'
import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'
import { ThematicBreak } from '../../SyntaxNodes/ThematicBreak'
import { LineConsumer } from './LineConsumer'
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
import { OutlineParser } from './OutlineParser'


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


export function getOutlineSyntaxNodes(args: OutlineParser.Args): OutlineSyntaxNode[] {
  const { markupLines, headingLeveler, settings } = args

  // Alright! Our first task is to strip away any leading and trailing lines that
  // are entirely blank. These outer blank lines carry no semantic significance,
  // and we don't want them to be inadvertently parsed as thematic breaks.
  //
  // For what it's worth, we *do* allow thematic breaks at the beginning and end of
  // the document, but they must deliberately be produced from streaks rather than
  // from blank lines. For example:
  //
  // #~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#~#

  let firstIndexOfNonBlankLine = 0
  for (; firstIndexOfNonBlankLine < markupLines.length; firstIndexOfNonBlankLine++) {
    if (NON_BLANK_PATTERN.test(markupLines[firstIndexOfNonBlankLine])) {
      break
    }
  }

  const initialSourceLineNumber =
    args.sourceLineNumber + firstIndexOfNonBlankLine

  let lastIndexOfNonBlankLine = markupLines.length - 1
  for (; lastIndexOfNonBlankLine >= 0; lastIndexOfNonBlankLine--) {
    if (NON_BLANK_PATTERN.test(markupLines[lastIndexOfNonBlankLine])) {
      break
    }
  }

  const markupWithoutOuterBlankLines =
    markupLines.slice(firstIndexOfNonBlankLine, lastIndexOfNonBlankLine + 1)

  const markupLineConsumer = new LineConsumer(markupWithoutOuterBlankLines)
  const nodes: OutlineSyntaxNode[] = []

  // We're all set up. Here's our main parser loop!
  while (!markupLineConsumer.done()) {
    const sourceLineNumber =
      initialSourceLineNumber + markupLineConsumer.countLinesConsumed()

    const outlineParserArgs: OutlineParser.Args = {
      markupLines: markupLineConsumer.remaining(),
      sourceLineNumber,
      headingLeveler,
      settings
    }

    for (const parse of OUTLINE_CONVENTION_PARSERS) {
      const result = parse(outlineParserArgs)

      if (!result) {
        continue;
      }

      // We parsed some syntax nodes!
      for (const newNode of result.parsedNodes) {
        // To produce a cleaner document, we condense multiple consecutive thematic
        // breaks into one.
        if (last(nodes) instanceof ThematicBreak && newNode instanceof ThematicBreak) {
          // Rather than add a consecutive thematic break, let's just move on to the
          // next new node.
          continue;
        }

        if (settings.createSourceMap) {
          newNode.sourceLineNumber = sourceLineNumber
        }

        nodes.push(newNode)
      }

      // If we've made it here, it means we produced a result. Let's advance our line consumer...
      markupLineConsumer.advance(result.countLinesConsumed)
      // ... and start parsing at the new position!
      break;
    }
  }

  return nodes
}
