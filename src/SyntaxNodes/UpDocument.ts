import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'
import { insertFootnoteBlocksAndAssignFootnoteReferenceNumbers } from './insertFootnoteBlocksAndAssignFootnoteReferenceNumbers'
import { Heading } from './Heading'


export class UpDocument extends OutlineSyntaxNodeContainer {
  constructor(
    children: OutlineSyntaxNode[],
    public tableOfContents = new UpDocument.TableOfContents([])
  ) {
    super(children)
  }
}


export namespace UpDocument {
  // Returns a document object with:
  //
  // 1. Footnotes extracted into footnote blocks
  // 2. A table of contents produced from `children`
  // 3. Internal references associated with the apprioriate table of contents entry 
  export function create(children: OutlineSyntaxNode[]): UpDocument {
    const document = new UpDocument(children)
    insertFootnoteBlocksAndAssignFootnoteReferenceNumbers(document)

    const tableOfContentsEntries = document.descendantHeadingsToIncludeInTableOfContents()

    if (tableOfContentsEntries.length) {
      document.tableOfContents = new UpDocument.TableOfContents(tableOfContentsEntries)
    }

    return document
  }


  export class TableOfContents {
    constructor(public entries: Heading[]) { }
  }
}
