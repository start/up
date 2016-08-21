import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'
import { Heading } from './Heading'
import { insertFootnoteBlocksAndAssignFootnoteReferenceNumbers } from './insertFootnoteBlocksAndAssignFootnoteReferenceNumbers'
import { concat } from '../CollectionHelpers'

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
      TableOfContents.getEntries(children)

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

    export function getEntries(nodes: OutlineSyntaxNode[]): UpDocument.TableOfContents.Entry[] {
      // Right now, only headings can be table of contents entries.
      return concat(
        nodes.map(node =>
          node instanceof Heading
            ? [node]
            : node.descendantsToIncludeInTableOfContents()))
    }
  }
}
