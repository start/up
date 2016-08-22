import { InlineSyntaxNode } from './InlineSyntaxNode'
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
    // For the sake of writing simpler unit tests, we want to avoid any processing in UpDocument's
    // constructor. Unfortunately, the process of 
    //
    // Unfortunately, the process of producing a ready-to-use UpDocument has become a tad scattered and
    // Rube-Goldberg-esque. It needs to be revisited.

    // First, let's create our table of contents. It's up to each outline syntax node whether to allow
    // its descendants to be referenced by the table of contents. Some don't (e.g. blockquotes).
    const tableOfContents =
      UpDocument.TableOfContents.create(children)

    // Alright! We now have everything we need to produce our document!
    const document = new UpDocument(children, tableOfContents)

    // But... our document is still not quite ready yet.
    //
    // If there are any references to table of contents entries, they still need to be matched with the
    // appropriate entries. Let's take care of that now.
    for (const inlineSyntaxNode of document.inlineDescendants()) {
      if (inlineSyntaxNode instanceof ReferenceToTableOfContentsEntry) {
        inlineSyntaxNode.referenceMostAppropriateTableOfContentsEntry(document.tableOfContents)
      }
    }

    // Finally, if there are any footnotes, they still need their reference numbers, and they still
    // need to be extracted into blocks. Let's do it.
    insertFootnoteBlocksAndAssignFootnoteReferenceNumbers(document)

    // Whew. We're done!
    return document
  }

  constructor(children: OutlineSyntaxNode[], public tableOfContents = new UpDocument.TableOfContents()) {
    super(children)
  }
}


export namespace UpDocument {
  export class TableOfContents {
    // This mutates tbale`nodes`, assigning their `ordinalInTableOfContents`.
    static create(documentChildren: OutlineSyntaxNode[]): TableOfContents {

      const entries = TableOfContents.getEntries(documentChildren)

      for (let i = 0; i < entries.length; i++) {
        entries[i].ordinalInTableOfContents = i + 1
      }

      return new TableOfContents(entries)
    }

    static getEntries(nodes: OutlineSyntaxNode[]): TableOfContents.Entry[] {
      // Right now, only headings can be table of contents entries.
      // TODO: Revisit
      return concat(
        nodes.map(node =>
          node instanceof Heading ? [node] : node.descendantsToIncludeInTableOfContents()))
    }

    constructor(public entries: TableOfContents.Entry[] = []) { }
  }


  export namespace TableOfContents {
    // UpDocument.TableOfContents.Entry
    export interface Entry {
      ordinalInTableOfContents: number
      text(): string
      level: number
      tableOfContentsRepresentation(): InlineSyntaxNode[]
    }
  }
}
