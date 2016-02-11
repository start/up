import { RichSyntaxNodeType } from '../../SyntaxNodes/RichSyntaxNode'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { ParseArgs, Parser } from '../Parser'
import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { parseInline } from './ParseInline'


export function getSandwichParser(
  NodeType: RichSyntaxNodeType,
  startingBun: string,
  endingBun: string
): Parser {
  return (text, parseArgs, onParse): boolean => {
    
    // If the text starts with the parent node's terminator, we have an opportunity to
    // close the parent node. However, if that terminator starts with this sandwich's
    // starting "bun", then we will *always* start parsing this sandwich instead.
    //
    // To avoid that, we check for those two conditions. If both are true, we fail to
    // parse this sandwich, allowing the parent node to close.
    if (startsWith(text, parseArgs.terminator) && startsWith(parseArgs.terminator, startingBun)) {
      return false
    }
    
    const consumer = new TextConsumer(text)
    
    if (!consumer.consumeIf(startingBun)) {
      return false
    }
    
    const sandwichNode = new NodeType()
    sandwichNode.parentNode = parseArgs.parentNode
    
    return parseInline(consumer.remaining(), {parentNode: sandwichNode, terminator: endingBun}, (nodes, countCharsParsed) => {
      consumer.skip(countCharsParsed)
      sandwichNode.addChildren(nodes)
      onParse([sandwichNode], consumer.countCharsAdvanced())
    })
  }
}

function startsWith(haystack: string, needle: string) {
  return needle && haystack && (needle === haystack.substr(0, needle.length))
}