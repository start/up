import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'
import { insertFootnoteBlocksAndAssignFootnoteReferenceNumbers } from './insertFootnoteBlocksAndAssignFootnoteReferenceNumbers'


export class UpDocument extends OutlineSyntaxNodeContainer {
  constructor(
    children: OutlineSyntaxNode[],
    public tableOfContents: UpDocument.TableOfContents = undefined
  ) {
    super(children)
  }
}


export namespace UpDocument {
  export class TableOfContents {
    constructor(public entries: OutlineSyntaxNode[]) { }
  }
}


// This function returns a document object with:
//
// 1. Footnotes extracted into footnote blocks
// 2. A table of contents (if it's asked to create one)
export function createUpDocument(
  args: {
    children: OutlineSyntaxNode[]
    createTableOfContents: boolean
  }
): UpDocument {
  const document = new UpDocument(args.children)
  insertFootnoteBlocksAndAssignFootnoteReferenceNumbers(document)

  if (args.createTableOfContents) {
    const tableOfContentsEntries = document.descendantsToIncludeInTableOfContents()

    // An empty table of contents wouldn't be very useful! Let's avoid creating them.
    if (tableOfContentsEntries.length) {
      document.tableOfContents = new UpDocument.TableOfContents(tableOfContentsEntries)
    }
  }

  return document
}
