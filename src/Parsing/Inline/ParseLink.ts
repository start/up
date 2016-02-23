import { parseInline } from './ParseInline'
import { TextConsumer } from '../TextConsumer'
import { applyBackslashEscaping } from '../TextHelpers'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { ParseContext, OnParse } from '../Parser'
import { InlineParserArgs, InlineParser } from './InlineParser'

export function parseLink(args: InlineParserArgs): boolean {  
  const consumer = new TextConsumer(args.text)
  const linkNode = new LinkNode(args.parentNode)
  
  // Links cannot be nested within other links
  if (linkNode.ancestors().some(ancestor => ancestor instanceof LinkNode)) {
    return false
  }
  
  // TODO: Handle  terminator?

  return (
    // Parse the opening bracket
    consumer.consumeIfMatches('[')
    
    // Parse the link's content and the URL arrow
    && parseInline(consumer.remainingText(), { parentNode: linkNode, inlineTerminator: ' -> ' },
      (nodes, countChars) => {
        consumer.skip(countChars)
        linkNode.addChildren(nodes)
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