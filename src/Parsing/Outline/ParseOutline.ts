import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { ParseResult } from '.././ParseResult'
import { parseInline } from '../Inline/ParseInline'

import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'

import { TextConsumer } from '../../TextConsumption/TextConsumer'

export function parseOutline(text: string): ParseResult {
  let nodes: SyntaxNode[] = []

  const consumer = new TextConsumer(text)
  
  while (!consumer.done()) {
    consumer.consumeLine((line, remaining, skip, reject) => {
      if (/\S/.test(line)) {
        const paragraphNode = new ParagraphNode()
        paragraphNode.addChildren(parseInline(line, paragraphNode).nodes)
        nodes.push(paragraphNode)
      }
    })
  }

  return new ParseResult(nodes, text.length)
}