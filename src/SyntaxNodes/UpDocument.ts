import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'
import { Heading } from './Heading'
import { getEntriesForTableOfContents } from './getEntriesForTableOfContents'
import { insertFootnoteBlocksAndAssignFootnoteReferenceNumbers } from './insertFootnoteBlocksAndAssignFootnoteReferenceNumbers'


export class UpDocument extends OutlineSyntaxNodeContainer {
  constructor(
    children: OutlineSyntaxNode[],
    public tableOfContents = new UpDocument.TableOfContents()
  ) {
    super(children)
  }
}


export namespace UpDocument {
  // Returns a document object with:
  //
  // 1. Footnotes extracted into footnote blocks
  // 2. A table of contents produced from `children`
  // 3. Internal references associated with the apprioriate table of contents entries
  export function create(children: OutlineSyntaxNode[]): UpDocument {
    const tableOfContentsEntries =
      getEntriesForTableOfContents(children)

    const document =
      new UpDocument(
        children, new UpDocument.TableOfContents(tableOfContentsEntries))

    insertFootnoteBlocksAndAssignFootnoteReferenceNumbers(document)

    return document
  }


  export class TableOfContents {
    constructor(public entries: TableOfContents.Entry[] = []) { }
  }


  export namespace TableOfContents {
    export type Entry = Heading
  }
}
