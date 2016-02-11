import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { parseInline } from '../Inline/ParseInline'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { parseSectionSeparatorWhitespace } from './SectionSeparatorWhitespaceParser'
import { OnParse } from '../Parser'

export function parseOutline(text: string, onParse: OnParse): boolean {
  let outlineNodes: SyntaxNode[] = []

  const consumer = new TextConsumer(text)

  while (!consumer.done()) {    
    if (parseSectionSeparatorWhitespace(consumer.remaining(), (sectionSeparatorNodes, countCharsAdvanced) => {
      outlineNodes.push.apply(outlineNodes, sectionSeparatorNodes)
      consumer.skip(countCharsAdvanced)
    })) {
      continue
    }

    if (consumer.consumeLineIf(/\S/, (nonBlankLine) => {
      const paragraphNode = new ParagraphNode()
      parseInline(nonBlankLine, paragraphNode, null, (inlineNodes) => {
        paragraphNode.addChildren(inlineNodes)
        outlineNodes.push(paragraphNode)
      })
    })) {
      continue
    }

    consumer.consumeLine()
  }

  onParse(outlineNodes, consumer.countCharsAdvanced())
  return true
}