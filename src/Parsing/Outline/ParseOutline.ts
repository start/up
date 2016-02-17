import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { parseInline } from '../Inline/ParseInline'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { parseSectionSeparatorStreak } from './ParseSectionSeparatorStreak'
import { getHeadingParser } from './GetHeadingParser'
import { parseSectionSeparatorWhitespace } from './ParseSectionSeparatorWhitespace'
import { parseLineBlock } from './ParseLineBlock'
import { parseCodeBlock } from './ParseCodeBlock'
import { parseBlockquote } from './ParseBlockquote'
import { parseBulletedList } from './ParseBulletedList'
import { ParseArgs, OnParse } from '../Parser'
import { startsWith, endsWith, streakOf, dottedStreakOf, BLANK, NON_BLANK, INLINE_WHITESPACE_CHAR, ANY_WHITESPACE} from './Patterns'


const BLANK_PATTERN = new RegExp(
  BLANK
)

const TRAILING_WHITESPACE_PATTERN = new RegExp(
	endsWith(ANY_WHITESPACE)
)

const LEADING_BLANK_LINES_PATTERN = new RegExp(
	startsWith(ANY_WHITESPACE + '\n')
)

const NON_BLANK_PATTERN = new RegExp(
  NON_BLANK
) 

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
  parseBulletedList,
  parseLineBlock,
  parseSectionSeparatorWhitespace
]


export function parseOutline(text: string, parseArgs: ParseArgs, onParse: OnParse): boolean {
  const outlineNodes: SyntaxNode[] = []
  
  const originalTextLength = text.length
  
  // Leading and trailing blank lines are ignored.
  //
  // This also trims trailing whitespace from the last non-blank line, but that won't affect parsing.
  const trimmedText = text
    .replace(LEADING_BLANK_LINES_PATTERN, '')
    .replace(TRAILING_WHITESPACE_PATTERN, '')
  
  const countCharsTrimmed = text.length - trimmedText.length
  
  const consumer = new TextConsumer(trimmedText)
  
  // Leading blank lines are ignored. We can't blindly trim leading all whitespace, because indentation
  // 
  while (consumer.consumeLineIf(BLANK_PATTERN)) { }

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
    if (consumer.consumeLineIf(NON_BLANK_PATTERN, (line) => {
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

  onParse(outlineNodes, countCharsTrimmed + consumer.countCharsAdvanced(), parseArgs.parentNode)
  return true
}