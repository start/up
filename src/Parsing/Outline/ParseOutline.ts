import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { parseInline } from '../Inline/ParseInline'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { parseSectionSeparatorWhitespace } from './SectionSeparatorWhitespaceParser'
import { ParseArgs, OnParse } from '../Parser'
import { NON_BLANK_LINE } from './Patterns'


const conventionParsers = [
  parseSectionSeparatorWhitespace
]

export function parseOutline(text: string, parseArgs: ParseArgs, onParse: OnParse): boolean {
  let outlineNodes: SyntaxNode[] = []
  const consumer = new TextConsumer(text)

  main_parser_loop:
  while (!consumer.done()) {

    for (let parser of conventionParsers) {
      if (parser(consumer.remaining(), parseArgs,
        (sectionSeparatorNodes, countCharsAdvanced) => {
          outlineNodes.push.apply(outlineNodes, sectionSeparatorNodes)
          consumer.skip(countCharsAdvanced)
        })) {
        continue main_parser_loop
      }
    }

    // Alright, none of the other conventions applied. If the current line isn't blank,
    // we're going to treat it as a regular paragraph.
    if (consumer.consumeLineIf(NON_BLANK_LINE, (nonBlankLine) => {
      parseInline(nonBlankLine, { parentNode: new ParagraphNode(parseArgs.parentNode) },
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