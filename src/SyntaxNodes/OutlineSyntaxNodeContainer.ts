import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { concat } from '../CollectionHelpers'


export abstract class OutlineSyntaxNodeContainer {
  constructor(public children: OutlineSyntaxNode[]) { }

  descendantsToIncludeInTableOfContents(): OutlineSyntaxNode[] {
    return concat(
      this.children.map(child => {
        const descendantsToIncludeInTableOfContents = child.descendantsToIncludeInTableOfContents()

        // Right now, there aren't outline conventions that both:
        //
        // 1. Should be included in the table of contents, *and*
        // 2. Can contain other conventions that should be included in the table of contents
        //
        // However, if such a convention were to exist, outer convention should be included first.
        if (child.shouldBeIncludedInTableOfContents()) {
          descendantsToIncludeInTableOfContents.unshift(child)
        }

        return descendantsToIncludeInTableOfContents
      }))
  }
}
