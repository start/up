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
import { parseParagraph } from './ParseParagraph'
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
  parseSectionSeparatorWhitespace,
  parseParagraph
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
  
  main_parser_loop:
  while (!consumer.done()) {
    const remainingText = consumer.remainingText()
    
    for (let parser of conventionParsers) {
      if (parser(remainingText, parseArgs,
        (parsedNodes, countCharsAdvanced) => {
          outlineNodes.push.apply(outlineNodes, parsedNodes)
          consumer.skip(countCharsAdvanced)
        })) {
        continue main_parser_loop
      }
    }

    // The current line is blank, but it's not a section separator! Let's skip it and
    // move on to the next line.
    consumer.consumeLine()
  }

  onParse(outlineNodes, countCharsTrimmed + consumer.countCharsAdvanced(), parseArgs.parentNode)
  return true
}