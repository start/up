import { RichSyntaxNodeType } from '../../SyntaxNodes/RichSyntaxNode'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { Parser } from '../Parser'
import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { parseInline } from './ParseInline'


export function getSandwichParser(
  NodeType: RichSyntaxNodeType,
  startingBun: string,
  endingBun: string
): Parser {
  return (text, parentNode, parentTerminator, onParse): boolean => {
    
    // If the text starts with the parent node's terminator, we have an opportunity to
    // close the parent node. However, if that terminator starts with this sandwich's
    // starting "bun", then we will *always* start parsing this sandwich instead.
    //
    // To avoid that, we check for those two conditions. If both are true, we fail to
    // parse this sandwich, allowing the parent node to close.
    if (startsWith(text, parentTerminator) && startsWith(parentTerminator, startingBun)) {
      return false
    }
    
    const consumer = new TextConsumer(text)
    
    if (!consumer.consumeIf(startingBun)) {
      return false
    }
    
    const sandwichNode = new NodeType()
    sandwichNode.parentNode = parentNode
    const inlineResult = parseInline(consumer.remaining(), sandwichNode, endingBun)
    
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