import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'
import { Heading } from './Heading'
import { insertFootnoteBlocksAndAssignFootnoteReferenceNumbers } from './insertFootnoteBlocksAndAssignFootnoteReferenceNumbers'
import { concat } from '../CollectionHelpers'

export class UpDocument extends OutlineSyntaxNodeContainer {
  // Returns a document object with:
  //
  // 1. Footnotes extracted into footnote blocks
  // 2. A table of contents produced from `children`
  // 3. Internal references associated with the apprioriate table of contents entries
  static create(children: OutlineSyntaxNode[]): UpDocument {
    // For the sake of our unit tests, we want to avoid any processing in UpDocument's constructor.
    // However, this process is a tad Rube-Goldberg-ish. It needs to be revisited.

    // First, let's get all the entries for the table of contents. It's up to each outline syntax node
    // whether to to include any descendants in the table of contents. Some don't (e.g. blockquotes).
    const tableOfContentsEntries =
      UpDocument.TableOfContents.getEntries(children)

    // Now, we have everything we need to produce our document!
    const document = new UpDocument(
      children, new UpDocument.TableOfContents(tableOfContentsEntries))

    // Now, it gets really messy.

    // Our footnote blocks still don't have their reference numbers, and they haven't been extracted
    // into blocks yet. Let's solve that.
    insertFootnoteBlocksAndAssignFootnoteReferenceNumbers(document)

    // TODO: Reference to table of contents

    return document
  }

  constructor(
    children: OutlineSyntaxNode[],
    public tableOfContents = new UpDocument.TableOfContents()
  ) {
    super(children)
  }
}


export namespace UpDocument {
  export class TableOfContents {
    static getEntries(nodes: OutlineSyntaxNode[]): UpDocument.TableOfContents.Entry[] {
      // Right now, only headings can be table of contents entries.
      return concat(
        nodes.map(node =>
          node instanceof Heading
            ? [node]
            : node.descendantsToIncludeInTableOfContents()))
    }

    constructor(public entries: TableOfContents.Entry[] = []) { }
  }

  export namespace TableOfContents {
    export type Entry = Heading
  }
}
