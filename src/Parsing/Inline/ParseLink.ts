import { parseInlineConventions } from './ParseInlineConventions'
import { TextConsumer } from '../TextConsumer'
import { applyBackslashEscaping } from '../TextHelpers'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { InlineParserArgs, InlineParser } from './InlineParser'

export function parseLink(args: InlineParserArgs): boolean {
  const consumer = new TextConsumer(args.text)
  const linkNode = new LinkNode(args.parentNode)
  
  if (linkNode.ancestors().some(ancestor => ancestor instanceof LinkNode)) {
    // Links cannot be nested within other links
    return false
  }
  
  // TODO: Handle  terminator?

  return (
    // Parse the opening bracket
    consumer.consumeIfMatches('[')
    
    // Parse the link's content and the URL arrow
    && parseInlineConventions({
      text: consumer.remainingText(),
      parentNode: linkNode,
      endsWith: ' -> ',
      doesNotHave: ']',
      onlyIf: (inlineConsumer) => inlineConsumer.areSquareBracketsBalanced(),
      then: (resultNodes, lengthParsed) => {
        consumer.skip(lengthParsed)
        linkNode.addChildren(resultNodes)
      }
    })
      
    // Parse the URL and the closing bracket
    && consumer.consumeUpTo({
      needle: ']',
      then: (url) => {
        linkNode.url = applyBackslashEscaping(url)
        args.then([linkNode], consumer.lengthConsumed())
      }
    })
  )
}