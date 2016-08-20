import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { Heading } from './Heading'
import { concat } from '../CollectionHelpers'


// Returns Which
export function allHeadingsToIncludeInTableOfContents(nodes: OutlineSyntaxNode[]): Heading[] {
  return concat(
    nodes.map(node =>
      node instanceof Heading
        ? [node]
        : node.descendantHeadingsToIncludeInTableOfContents()
    ))
}
