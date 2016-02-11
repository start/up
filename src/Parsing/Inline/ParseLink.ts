import { parseInline } from './ParseInline'
import { TextConsumer } from '../../TextConsumption/TextConsumer'
import { RichSyntaxNode } from '../../SyntaxNodes/RichSyntaxNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { OnParse } from '../Parser'

// Todo: Handle parent node's terminator?

export function parseLink(text: string, parentNode: RichSyntaxNode, onParse: OnParse): boolean {
  const consumer = new TextConsumer(text)
  
  // Links cannot be nested within other links 
  if (parentNode.orAnyAncestor(ancestor => ancestor instanceof LinkNode)) {
    return false
  }
  
  // Parse the opening `[`
  if (!consumer.consumeIf('[')) {
    return false
  }

  const linkNode = new LinkNode()
  linkNode.parentNode = parentNode
  
  // Parse the content, which ends with the ` -> ` pointing to the URL
  if (!parseInline(consumer.remaining(), linkNode, ' -> ', (nodes, countChars) => {
    consumer.skip(countChars)
    linkNode.addChildren(nodes)
  })) {
    return false
  }

  // Parse the URL, which ends with the closing `]` 
  while (!consumer.done()) {
    if (consumer.consumeIf(']')) {
      onParse([linkNode], consumer.countCharsAdvanced())
      return true
    }

    linkNode.url += consumer.currentChar()
    consumer.moveNext()
  }

  return false
}