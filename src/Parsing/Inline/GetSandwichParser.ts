import { RichSyntaxNodeType } from '../../SyntaxNodes/RichSyntaxNode'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { Parser } from '../Parser'
import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { parseInline } from './ParseInline'

export function getSandwichParser(
  NodeType: RichSyntaxNodeType,
  openingBun: string,
  closingBun: string
): Parser {
  return (text, parentNode, onParse): boolean => {
    const consumer = new TextConsumer(text)
    
    if (!consumer.consumeIf(openingBun)) {
      return false
    }
    
    const inlineResult = parseInline(consumer.remaining(), parentNode, closingBun)
    
    if (!inlineResult.success) {
      return false
    }
    
    consumer.skip(inlineResult.countCharsParsed)
    
    const sandwichNode = new NodeType(inlineResult.nodes)
    onParse([sandwichNode], consumer.countCharsAdvanced())
    
    return true
  }
}