import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { concat } from '../CollectionHelpers'


export abstract class OutlineSyntaxNodeContainer {
  constructor(public children: OutlineSyntaxNode[]) { }

  childrenToIncludeInTableOfContents(): OutlineSyntaxNode[] {
    return concat(
      this.children.map(child => child.childrenToIncludeInTableOfContents()))
  }
}
