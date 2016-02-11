import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { parseInline } from '../Inline/ParseInline'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { parseSectionSeparatorWhitespace } from './SectionSeparatorWhitespaceParser'
import { ParseArgs, OnParse } from '../Parser'
import { NON_BLANK_LINE } from './Patterns'

export function parseOutline(text: string, parseArgs: ParseArgs, onParse: OnParse): boolean {
  let outlineNodes: SyntaxNode[] = []
  const consumer = new TextConsumer(text)

  while (!consumer.done()) {
    if (parseSectionSeparatorWhitespace(consumer.remaining(), parseArgs,
      (sectionSeparatorNodes, countCharsAdvanced) => {
        outlineNodes.push.apply(outlineNodes, sectionSeparatorNodes)
        consumer.skip(countCharsAdvanced)
      })) {
      continue
    }

    if (consumer.consumeLineIf(NON_BLANK_LINE, (nonBlankLine) => {
      parseInline(nonBlankLine, { parentNode: new ParagraphNode(parseArgs.parentNode) },
        (inlineNodes, countCharsAdvanced, paragraphNode) => {
          paragraphNode.addChildren(inlineNodes)
          outlineNodes.push(paragraphNode)
        })
    })) {
      continue
    }

    consumer.consumeLine()
  }

  onParse(outlineNodes, consumer.countCharsAdvanced(), parseArgs.parentNode)
  return true
}