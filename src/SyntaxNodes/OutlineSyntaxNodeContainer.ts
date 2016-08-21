import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { UpDocument } from './UpDocument'


export abstract class OutlineSyntaxNodeContainer {
  constructor(public children: OutlineSyntaxNode[]) { }

  descendantsToIncludeInTableOfContents(): UpDocument.TableOfContents.Entry[] {
    return UpDocument.TableOfContents.getEntries(this.children)
  }
}
