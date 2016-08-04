import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'


export class DocumentNode extends OutlineSyntaxNodeContainer {
  constructor(children: OutlineSyntaxNode[], public tableOfContents?: DocumentNode.TableOfContents) {
    super(children)
  }
}


export namespace DocumentNode {
  export class TableOfContents {
    constructor(public entries: OutlineSyntaxNode[]) { }
  }
}
