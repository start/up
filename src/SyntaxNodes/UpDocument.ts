import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'
import { insertFootnoteBlocksAndAssignFootnoteReferenceNumbers } from './insertFootnoteBlocksAndAssignFootnoteReferenceNumbers'


export class UpDocument extends OutlineSyntaxNodeContainer {
  constructor(children: OutlineSyntaxNode[], public tableOfContents?: UpDocument.TableOfContents) {
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
// 2. A table of contents
export function createUpDocument(children: OutlineSyntaxNode[]): UpDocument {
  const document = new UpDocument(children)
  insertFootnoteBlocksAndAssignFootnoteReferenceNumbers(document)

  const tableOfContentsEntries = document.descendantsToIncludeInTableOfContents()
  document.tableOfContents = new UpDocument.TableOfContents(tableOfContentsEntries)

  return document
}
