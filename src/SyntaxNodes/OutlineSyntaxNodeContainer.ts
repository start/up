import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { Document } from './Document'
import { concat } from '../CollectionHelpers'


export abstract class OutlineSyntaxNodeContainer {
  constructor(public children: OutlineSyntaxNode[]) { }

  descendantsToIncludeInTableOfContents(): Document.TableOfContents.Entry[] {
    return Document.TableOfContents.getEntries(this.children)
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return concat(
      this.children.map(node => node.inlineDescendants()))
  }
}
