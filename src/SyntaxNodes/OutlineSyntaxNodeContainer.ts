import { concat } from '../CollectionHelpers'
import { Document } from './Document'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'


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
