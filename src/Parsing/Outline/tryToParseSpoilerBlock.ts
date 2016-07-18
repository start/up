import { LineConsumer } from './LineConsumer'
import { BlockquoteNode } from '../../SyntaxNodes/BlockquoteNode'
import { getOutlineNodes } from './getOutlineNodes'
import { INDENTED_PATTERN, BLANK_PATTERN } from '../Patterns'
import { patternStartingWith, optional } from '../PatternHelpers'
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
  
  args.then([], consumer.countLinesConsumed)
  return true
}
