import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'
import { ParseResult } from '.././ParseResult'
import { parseInline } from '../Inline/ParseInline'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { parseSectionSeparatorWhitespace } from './SectionSeparatorWhitespaceParser'

export function parseOutline(text: string): ParseResult {
  let nodes: SyntaxNode[] = []

  const consumer = new TextConsumer(text)

  while (!consumer.done()) {
    const sectionSeparatorWhitespaceResult = parseSectionSeparatorWhitespace(consumer.remaining())

    if (sectionSeparatorWhitespaceResult.success) {
      nodes.push(new SectionSeparatorNode())
      consumer.skip(sectionSeparatorWhitespaceResult.countCharsParsed)
      continue
    }

    if (consumer.consumeLineIf(/\S/, (nonBlankLine) => {
      const paragraphNode = new ParagraphNode()
      parseInline(nonBlankLine, paragraphNode, null, (inlineNodes, inlineCountCharsParsed) => {
        paragraphNode.addChildren(inlineNodes)
        nodes.push(paragraphNode)
      })
    })) {
      continue
    }

    consumer.consumeLine()
  }

  return new ParseResult(nodes, text.length)
}