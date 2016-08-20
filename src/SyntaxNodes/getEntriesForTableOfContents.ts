import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { UpDocument } from './UpDocument'
import { Heading } from './Heading'
import { concat } from '../CollectionHelpers'


export function getEntriesForTableOfContents(nodes: OutlineSyntaxNode[]): UpDocument.TableOfContents.Entry[] {
  return concat(
    nodes.map(node =>
      node instanceof Heading
        ? [node]
        : node.descendantsToIncludeInTableOfContents()
    ))
}
