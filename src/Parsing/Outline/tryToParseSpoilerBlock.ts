import { LineConsumer } from './LineConsumer'
import { SpoilerBlockNode } from '../../SyntaxNodes/SpoilerBlockNode'
import { getOutlineNodes } from './getOutlineNodes'
import { getIndentedBlock } from './getIndentedBlock'
import { solelyAndIgnoringCapitalization, escapeForRegex } from '../PatternHelpers'
import { OutlineParserArgs } from './OutlineParserArgs'


// A line consisting solely of "spoiler:" followed by an indented block is treated as a spoiler.
// Spoilers can contain any outline convention, even other spoilers.
//
// The term for "spoiler" is configurable and case-insensitive, and an optional blank line can
// precede the indented block.
//
// SPOILER:
// 
//   After you beat the Elite Four, you still have to face your rival.
//
//   His specific lineup depends on his starter Pokémon, but his first three are always the same:
//
//   1. Pidgeot
//   2. Alakazam
//   3. Rhydon
export function tryToParseSpoilerBlock(args: OutlineParserArgs): boolean {
  const consumer = new LineConsumer(args.lines)

  const indicatorLinePattern =
    solelyAndIgnoringCapitalization(
      escapeForRegex(args.config.settings.i18n.terms.spoiler) + ':')

  if (!consumer.consume({ linePattern: indicatorLinePattern })) {
    return false
  }

  const contentLines: string[] = []

  getIndentedBlock({
    lines: consumer.getRemainingLines(),
    then: (lines, lengthParsed) => {
      contentLines.push(...lines)
      consumer.skipLines(lengthParsed)
    }
  })

  if (!contentLines.length) {
    return false
  }

  const children = getOutlineNodes(contentLines, args.headingLeveler, args.config)

  args.then([new SpoilerBlockNode(children)], consumer.countLinesConsumed)
  return true
}
