import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'
import { Heading } from './Heading'
import { ReferenceToTableOfContentsEntry } from './ReferenceToTableOfContentsEntry'
import { insertFootnoteBlocksAndAssignFootnoteReferenceNumbers } from './insertFootnoteBlocksAndAssignFootnoteReferenceNumbers'
import { concat } from '../CollectionHelpers'


export class UpDocument extends OutlineSyntaxNodeContainer {
  // Returns an `UpDocument` object with:
  //
  // 1. Footnotes extracted into footnote blocks
  // 2. A table of contents produced from `children`
  // 3. Internal references associated with the apprioriate table of contents entries
  //
  // Responsibilities 1 and 3 mutate the `children` argument (and its descendants).
  static create(children: OutlineSyntaxNode[]): UpDocument {
    // Unfortunately, this process of producing a ready-to-use UpDocument has become a tad scattered.
    // It needs to be revisited.

    // First, let's create our table of contents. It's up to each outline syntax node whether to allow
    // its descendants to be referenced by the table of contents. Some don't (e.g. blockquotes).
    const tableOfContents =
      UpDocument.TableOfContents.createAndAssociateEntriesWithTheirReferences(children)

    // Alright! We now have everything we need to produce our document!
    const document = new UpDocument(children, tableOfContents)

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
    // Returns a `TableOfContents` object with entries from `documentChildren`.
    //
    // If there are references to table of contents entries within `documentChildren`, they are
    // associated with the appropriate entries (mutating the references).
    //
    // This methods also mutates the entries themselves, assigning them their table of contents
    // ordinals.
    static createAndAssociateEntriesWithTheirReferences(documentChildren: OutlineSyntaxNode[]): TableOfContents {
      const entries = TableOfContents.getEntries(documentChildren)

      //
      for (let i = 0; i < entries.length; i++) {
        entries[i].ordinalInTableOfContents = i + 1
      }

      const tableOfContents = new TableOfContents(entries)

      const allInlineSyntaxNodes = concat(
        documentChildren.map(child => child.inlineDescendants()))

      for (const inlineSyntaxNode of allInlineSyntaxNodes) {
        if (inlineSyntaxNode instanceof ReferenceToTableOfContentsEntry) {
          inlineSyntaxNode.referenceMostAppropriateTableOfContentsEntry(tableOfContents)
        }
      }

      return tableOfContents
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
      // The (1-based!) ordinal in the table of contents
      ordinalInTableOfContents: number

      // Semantically equivalent to a heading level. A level of 1 is most significant
      level: number

      // The "text" of an entry refers to its actual text content *after* any conventions are applied.
      // For example, if an entry was originally produced by the following markup:
      // 
      //    Why documents should consist *solely* of `<font>` elements
      //    ----------------------------------------------------------
      //
      // ... Then the entry's' text would be:
      //
      //    Why documents should consist solely of <font> elements
      //
      // References to table of contents entries try to match their `snippetFromEntry` with this
      // value.
      text(): string
      // How the content of the entry should be represented inside the table of contents. This is
      // in contrast to the representation of the entry's content in the document itself.
      representationOfContentWithinTableOfContents(): InlineSyntaxNode[]
    }
  }
}
