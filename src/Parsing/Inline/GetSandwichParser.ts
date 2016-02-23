import { RichSyntaxNodeType } from '../../SyntaxNodes/RichSyntaxNode'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { ParseContext, Parser } from '../Parser'
import { TextConsumer } from '../TextConsumer'
import { parseInline } from './ParseInline'
import { InlineParserArgs, InlineParser } from './InlineParser'


export function getSandwichParser(
  NodeType: RichSyntaxNodeType,
  startingBun: string,
  endingBun: string
): InlineParser {
  return (args: InlineParserArgs): boolean => {
    const { text, terminator, parentNode, then } = args
    
    // If the text starts with the terminator, and the terminator itself starts with
    // this sandwich's starting "bun", then we'd normally *always* start parsing this
    // sandwich instead of recognizing the terminator.
    //
    // To avoid that, we check for those two conditions. If both are true, we decline
    // to parse this sandwich, allowing the parent node to close.
    if (startsWith(text, terminator) && startsWith(terminator, startingBun)) {
      return false
    }
    const consumer = new TextConsumer(text)

    return (
      consumer.consumeIfMatches(startingBun)
      && parseInline(
        consumer.remainingText(),
        {
          parentNode: new NodeType(parentNode),
          inlineTerminator: endingBun
        },
        (contentNodes, lengthParsed, sandwichNode) => {
          consumer.skip(lengthParsed)
          sandwichNode.addChildren(contentNodes)
          then([sandwichNode], consumer.lengthConsumed())
        })
    )
  }
}

function startsWith(haystack: string, needle: string) {
  return needle && haystack && (needle === haystack.substr(0, needle.length))
}