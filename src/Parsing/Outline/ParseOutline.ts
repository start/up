import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { parseInline } from '../Inline/ParseInline'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { parseSectionSeparatorStreak } from './parseSectionSeparatorStreak'
import { getHeadingParser } from './GetHeadingParser'
import { parseSectionSeparatorWhitespace } from './ParseSectionSeparatorWhitespace'
import { parseLineBlock } from './ParseLineBlock'
import { parseCodeBlock } from './ParseCodeBlock'
import { parseBlockquote } from './ParseBlockquote'
import { ParseArgs, OnParse } from '../Parser'
import { streakOf, dottedStreakOf, either, NON_BLANK_LINE } from './Patterns'


const conventionParsers = [
  getHeadingParser(streakOf('#'), 1),
  getHeadingParser(streakOf('='), 2),
  getHeadingParser(streakOf('-'), 3),
  getHeadingParser(dottedStreakOf('#'), 4),
  getHeadingParser(dottedStreakOf('='), 5),
  getHeadingParser(dottedStreakOf('-'), 6),
  parseSectionSeparatorStreak,
  parseCodeBlock,
  parseBlockquote,
  parseLineBlock,
  parseSectionSeparatorWhitespace
]


export function parseOutline(text: string, parseArgs: ParseArgs, onParse: OnParse): boolean {
  const outlineNodes: SyntaxNode[] = []
  const consumer = new TextConsumer(text)

  main_parser_loop:
  while (!consumer.done()) {

    for (let parser of conventionParsers) {
      if (parser(consumer.remainingText(), parseArgs,
        (parsedNodes, countCharsAdvanced) => {
          outlineNodes.push.apply(outlineNodes, parsedNodes)
          consumer.skip(countCharsAdvanced)
        })) {
        continue main_parser_loop
      }
    }

    // Alright, none of the other conventions applied. If the current line isn't blank,
    // we're going to treat it as a regular paragraph.
    if (consumer.consumeLineIf(NON_BLANK_LINE, (line) => {
      parseInline(line, { parentNode: new ParagraphNode(parseArgs.parentNode) },
        (inlineNodes, countCharsAdvanced, paragraphNode) => {
          paragraphNode.addChildren(inlineNodes)
          outlineNodes.push(paragraphNode)
        })
    })) {
      continue
    }

    // The current line is blank! Let's skip it and move on to the next one.
    consumer.consumeLine()
  }

  onParse(outlineNodes, consumer.countCharsAdvanced(), parseArgs.parentNode)
  return true
}