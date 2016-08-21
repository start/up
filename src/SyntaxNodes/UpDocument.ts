import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'
import { Heading } from './Heading'
import { ReferenceToTableOfContentsEntry } from './ReferenceToTableOfContentsEntry'
import { insertFootnoteBlocksAndAssignFootnoteReferenceNumbers } from './insertFootnoteBlocksAndAssignFootnoteReferenceNumbers'
import { concat } from '../CollectionHelpers'

export class UpDocument extends OutlineSyntaxNodeContainer {
  // Returns a document object with:
  //
  // 1. Footnotes extracted into footnote blocks
  // 2. A table of contents produced from `children`
  // 3. Internal references associated with the apprioriate table of contents entries
  //
  // Responsibilities 1 and 3 mutate the `children` argument (and its descendants).
  static create(children: OutlineSyntaxNode[]): UpDocument {
    // For the sake of our unit tests, we want to avoid any processing in UpDocument's constructor.
    // However, this process is a tad scattered and Rube-Goldberg-ish. It needs to be revisited.
    //
    // First, let's get all the entries for the table of contents. It's up to each outline syntax node
    // whether to include its own descendants in the table of contents. Some don't (e.g. blockquotes).
    const tableOfContentsEntries =
      UpDocument.TableOfContents.getEntries(children)

    // We now have everything we need to produce our document!
    const document = new UpDocument(
      children, new UpDocument.TableOfContents(tableOfContentsEntries))

    // If there are any references to table of contents entries, they still need to be matched with the
    // appropriate entries (that isn't done during the parsing process). Let's take care of that now.
    for (const inlineSyntaxNode of document.inlineDescendants()) {
      if (inlineSyntaxNode instanceof ReferenceToTableOfContentsEntry) {
        inlineSyntaxNode.referenceMostAppropriateTableOfContentsEntry(document.tableOfContents.entries)
      }
    }

    // Also, our footnote still don't have their reference numbers, and they still haven't been
    // extracted into blocks. Let's take care of that.
    insertFootnoteBlocksAndAssignFootnoteReferenceNumbers(document)

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
