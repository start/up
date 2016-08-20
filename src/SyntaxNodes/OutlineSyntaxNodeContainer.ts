import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { Heading } from './Heading'
import { concat } from '../CollectionHelpers'


export abstract class OutlineSyntaxNodeContainer {
  constructor(public children: OutlineSyntaxNode[]) { }

  descendantsToIncludeInTableOfContents(): Heading[] {
    return concat(
      this.children.map(child =>
        child instanceof Heading
          ? [child]
          : child.descendantsToIncludeInTableOfContents()
      ))
  }
}
