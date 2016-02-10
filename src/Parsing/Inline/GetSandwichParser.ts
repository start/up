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
  return (text, parentNode, parentTerminatesOn, onParse): boolean => {
    
    if (startsWith(parentTerminatesOn, openingBun) && startsWith(text, parentTerminatesOn)) {
      return false
    }
    
    const consumer = new TextConsumer(text)
    
    if (!consumer.consumeIf(openingBun)) {
      return false
    }
    
    const sandwichNode = new NodeType()
    sandwichNode.parentNode = parentNode
    const inlineResult = parseInline(consumer.remaining(), sandwichNode, closingBun)
    
    if (!inlineResult.success) {
      return false
    }
    
    consumer.skip(inlineResult.countCharsParsed)
    
    sandwichNode.addChildren(inlineResult.nodes)
    onParse([sandwichNode], consumer.countCharsAdvanced())
    
    return true
  }
}

function startsWith(haystack: string, needle: string) {
  return needle && haystack && (needle === haystack.substr(0, needle.length))
}