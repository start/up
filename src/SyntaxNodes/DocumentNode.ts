import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'
import { insertFootnoteBlocksAndAssignFootnoteReferenceNumbers } from './insertFootnoteBlocksAndAssignFootnoteReferenceNumbers'


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


// This function returns a document node with:
//
// 1. Footnotes extracted into footnote blocks
// 2. A table of contents (if it's asked to create one)
export function createDocument(
  args: {
    children: OutlineSyntaxNode[]
    createTableOfContents: boolean
  }
): DocumentNode {
  const document = new DocumentNode(args.children)
  insertFootnoteBlocksAndAssignFootnoteReferenceNumbers(document)

  if (args.createTableOfContents) {
    const tableOfContentsEntries = document.descendantsToIncludeInTableOfContents()

    // An empty table of contents wouldn't be very useful! Let's avoid creating them.
    if (tableOfContentsEntries.length) {
      document.tableOfContents = new DocumentNode.TableOfContents(tableOfContentsEntries)
    }
  }

  return document
}
