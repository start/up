import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'


export class DocumentNode extends OutlineSyntaxNodeContainer {
  constructor(children: OutlineSyntaxNode[], public tableOfContents?: DocumentNode.TableOfContents) {
    super(children)
  }

  createTableOfContents(): void {
    this.tableOfContents =
      new DocumentNode.TableOfContents(this.descendantsToIncludeInTableOfContents())
  }
}


export namespace DocumentNode {
  export class TableOfContents {
    constructor(public entries: OutlineSyntaxNode[]) { }
  }
}
