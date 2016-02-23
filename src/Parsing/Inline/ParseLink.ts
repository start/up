import { parseInline } from './ParseInline'
import { TextConsumer } from '../TextConsumer'
import { applyBackslashEscaping } from '../TextHelpers'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { ParseContext, OnParse } from '../Parser'

// TODO: Handle parent node's inline terminator?

export function parseLink(text: string, parseArgs: ParseContext, onParse: OnParse): boolean {  
  const consumer = new TextConsumer(text)
  const linkNode = new LinkNode(parseArgs.parentNode)
  
  // Links be nested within other links
  if (linkNode.ancestors().some(ancestor => ancestor instanceof LinkNode)) {
    return false
  }

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
        onParse([linkNode], consumer.lengthConsumed(), parseArgs.parentNode)
      }
    })
  )
}