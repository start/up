import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'
import { RichInlineSyntaxNode, RichInlineSyntaxNodeType } from '../../SyntaxNodes/RichInlineSyntaxNode'
import { TextConsumer } from '../TextConsumer'
import { parseInlineConventions } from './ParseInlineConventions'
import { InlineParserArgs, InlineParser } from './InlineParser'

export function getSandwichParser(
  SandwichNodeType: RichInlineSyntaxNodeType,
  openingBun: string,
  closingBun: string
): InlineParser {
  return (args: InlineParserArgs): boolean => {
    const { text, endsWith, parentNodeTypes, then } = args
    
    // If the text starts with the terminator, and the terminator itself starts with
    // this sandwich's opening "bun", then we'd normally *always* start parsing this
    // sandwich instead of recognizing the terminator.
    //
    // To avoid that, we check for those two conditions. If both are true, we decline
    // to parse this sandwich, allowing the parent node to close.
    if (startsWith(text, endsWith) && startsWith(endsWith, openingBun)) {
      return false
    }
    const consumer = new TextConsumer(text)

    return (
      // Parse the opening bun
      consumer.consumeIfMatches(openingBun)
      
      // Parse the content and the closing bun
      && parseInlineConventions({
        text: consumer.remainingText(),
        parentNodeTypes: args.parentNodeTypes.concat([SandwichNodeType]),
        endsWith: closingBun,
        then: (resultNodes, lengthParsed) => {
          consumer.skip(lengthParsed)
          then([new SandwichNodeType(resultNodes)], consumer.lengthConsumed())
        }
      })
    )
  }
}

function startsWith(haystack: string, needle: string) {
  return needle && haystack && (needle === haystack.substr(0, needle.length))
}