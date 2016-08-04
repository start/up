import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { concat } from '../CollectionHelpers'


export abstract class OutlineSyntaxNodeContainer {
  constructor(public children: OutlineSyntaxNode[]) { }

  descendantsToIncludeInTableOfContents(): OutlineSyntaxNode[] {
    return concat(
      this.children.map(child => child.descendantsToIncludeInTableOfContents()))
  }
}
