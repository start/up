import { RichSyntaxNodeType } from '../../SyntaxNodes/RichSyntaxNode'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { TextConsumer } from '../TextConsumer'
import { parseInlineConventions } from './ParseInlineConventions'
import { InlineParserArgs, InlineParser } from './InlineParser'


export function getSandwichParser(
  NodeType: RichSyntaxNodeType,
  openingBun: string,
  closingBUn: string
): InlineParser {
  return (args: InlineParserArgs): boolean => {
    const { text, terminator, parentNode, then } = args
    
    // If the text starts with the terminator, and the terminator itself starts with
    // this sandwich's opening "bun", then we'd normally *always* start parsing this
    // sandwich instead of recognizing the terminator.
    //
    // To avoid that, we check for those two conditions. If both are true, we decline
    // to parse this sandwich, allowing the parent node to close.
    if (startsWith(text, terminator) && startsWith(terminator, openingBun)) {
      return false
    }
    const consumer = new TextConsumer(text)
    const sandwichNode = new NodeType(parentNode)

    return (
      // Parse the opening bun
      consumer.consumeIfMatches(openingBun)
      
      // Parse the content and the closing bun
      && parseInlineConventions({
        text: consumer.remainingText(),
        parentNode: sandwichNode,
        terminator: closingBUn,
        then: (resultNodes, lengthParsed) => {
          consumer.skip(lengthParsed)
          sandwichNode.addChildren(resultNodes)
          then([sandwichNode], consumer.lengthConsumed())
        }
      })
    )
  }
}

function startsWith(haystack: string, needle: string) {
  return needle && haystack && (needle === haystack.substr(0, needle.length))
}