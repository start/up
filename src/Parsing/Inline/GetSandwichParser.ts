import { RichSyntaxNodeType } from '../../SyntaxNodes/RichSyntaxNode'
import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { ParseContext, Parser } from '../Parser'
import { TextConsumer } from '../TextConsumer'
import { parseInline } from './ParseInline'


export function getSandwichParser(
  NodeType: RichSyntaxNodeType,
  startingBun: string,
  endingBun: string
): Parser {
  return (text, parseArgs, onParse): boolean => {
    
    // If the text starts with the terminator, and the terminator itself starts with
    // this sandwich's starting "bun", then we'd normally *always* start parsing this
    // sandwich instead of recognizing the terminator.
    //
    // To avoid that, we check for those two conditions. If both are true, we decline
    // to parse this sandwich, allowing the parent node to close.
    if (startsWith(text, parseArgs.inlineTerminator) && startsWith(parseArgs.inlineTerminator, startingBun)) {
      return false
    }
    const consumer = new TextConsumer(text)

    return (
      consumer.consumeIfMatches(startingBun)
      && parseInline(
        consumer.remainingText(), {
          parentNode: new NodeType(parseArgs.parentNode),
          inlineTerminator: endingBun
        },
        (contentNodes, countCharsParsed, sandwichNode) => {
          consumer.skip(countCharsParsed)
          sandwichNode.addChildren(contentNodes)
          onParse([sandwichNode], consumer.countCharsConsumed(), parseArgs.parentNode)
        })
    )
  }
}

function startsWith(haystack: string, needle: string) {
  return needle && haystack && (needle === haystack.substr(0, needle.length))
}