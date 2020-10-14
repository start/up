import { last } from '../../CollectionHelpers'
import { OutlineSyntaxNode } from '../../SyntaxNodes/OutlineSyntaxNode'
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


// This array includes every outline convention parser.
//
// We try these parsers in order until one of them finds a match. Then, we collect
// the resulting syntax nodes, consume the matched markup, and repeat the process.
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
  const markupLineConsumer = new LineConsumer(args.markupLines)
  const nodes: OutlineSyntaxNode[] = []

  // This is our main parser loop!
  while (!markupLineConsumer.done()) {
    const sourceLineNumber =
      args.sourceLineNumber + markupLineConsumer.countLinesConsumed()

    // We pass these args to every outline convention parser.
    const outlineParserArgs: OutlineParser.Args = {
      markupLines: markupLineConsumer.remaining(),
      mostRecentSibling: last(nodes),
      sourceLineNumber,
      headingLeveler: args.headingLeveler,
      settings: args.settings
    }

    for (const parse of OUTLINE_CONVENTION_PARSERS) {
      const result = parse(outlineParserArgs)

      if (!result) {
        continue
      }

      for (const newNode of result.parsedNodes) {
        if (args.settings.createSourceMap) {
          newNode.sourceLineNumber = sourceLineNumber
        }

        nodes.push(newNode)
      }

      // If we've made this far, it means our parser found a match.
      //
      // Let's advance our line consumer...
      markupLineConsumer.advance(result.countLinesConsumed)
      // ... and start over at the new markup position!
      break
    }
  }

  return nodes
}
