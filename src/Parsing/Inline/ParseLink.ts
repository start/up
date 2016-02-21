import { parseInline } from './ParseInline'
import { TextConsumer, applyBackslashEscaping } from '../../TextConsumption/TextConsumer'
import { RichSyntaxNode } from '../../SyntaxNodes/RichSyntaxNode'
import { LinkNode } from '../../SyntaxNodes/LinkNode'
import { ParseArgs, OnParse } from '../Parser'

// Todo: Handle parent node's terminator?

export function parseLink(text: string, parseArgs: ParseArgs, onParse: OnParse): boolean {
  const consumer = new TextConsumer(text)

  // Links cannot be nested within other links
  if (parseArgs.parentNode.orAnyAncestor(ancestor => ancestor instanceof LinkNode)) {
    return false
  }

  const linkNode = new LinkNode(parseArgs.parentNode)

  const didParseOpeningBracketAndContent =
    consumer.consumeIf('[')
    && parseInline(consumer.remainingText(), { parentNode: linkNode, inlineTerminator: ' -> ' },
      (nodes, countChars) => {
        consumer.skip(countChars)
        linkNode.addChildren(nodes)
      })

  return didParseOpeningBracketAndContent
    && consumer.consumeUpTo(']', (url) => {
      linkNode.url = applyBackslashEscaping(url)
      onParse([linkNode], consumer.countCharsConsumed(), parseArgs.parentNode)
    })
}