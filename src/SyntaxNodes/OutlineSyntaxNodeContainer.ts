import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { Document } from './Document'
import { concat } from '../CollectionHelpers'


export abstract class OutlineSyntaxNodeContainer {
  constructor(public children: OutlineSyntaxNode[]) { }

  // Any descendants (children, grandchildren, etc.) to include in the table of
  // contents.
  descendantsToIncludeInTableOfContents(): Document.TableOfContents.Entry[] {
    return Document.TableOfContents.getEntries(this.children)
  }

  // All inline descendants of `children`.
  inlineDescendants(): InlineSyntaxNode[] {
    return concat(
      this.children.map(node => node.inlineDescendants()))
  }
}
