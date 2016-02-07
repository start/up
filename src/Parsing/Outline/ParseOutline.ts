import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { ParseResult } from '.././ParseResult'
import { parseInline } from '../Inline/ParseInline'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { SectionSeparatorWhitespaceParser } from './SectionSeparatorWhitespaceParser'

export function parseOutline(text: string): ParseResult {
  let nodes: SyntaxNode[] = []

  const consumer = new TextConsumer(text)
  
  while (!consumer.done()) {    
    if (consumer.consumeLineIf(/\S/, (line) => {
        const paragraphNode = new ParagraphNode()
        paragraphNode.addChildren(parseInline(line, paragraphNode).nodes)
        nodes.push(paragraphNode)
    })) {
      continue
    }
    
    consumer.consumeLine()
  }

  return new ParseResult(nodes, text.length)
}