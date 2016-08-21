import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { UpDocument } from './UpDocument'
import { concat } from '../CollectionHelpers'


export abstract class OutlineSyntaxNodeContainer {
  constructor(public children: OutlineSyntaxNode[]) { }

  descendantsToIncludeInTableOfContents(): UpDocument.TableOfContents.Entry[] {
    return UpDocument.TableOfContents.getEntries(this.children)
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return concat(
      this.children.map(node => node.inlineDescendants()))
  }
}
