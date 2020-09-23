import { concat } from '../CollectionHelpers'
import { Heading } from './Heading'
import { insertFootnoteBlocksAndAssignFootnoteReferenceNumbers } from './insertFootnoteBlocksAndAssignFootnoteReferenceNumbers'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'
import { SectionLink } from './SectionLink'


export class Document extends OutlineSyntaxNodeContainer {
  // Returns an `Document` object with:
  //
  // 1. Footnotes extracted into footnote blocks
  // 2. A table of contents produced from `children`
  // 3. Section links associated with the apprioriate table of contents entries
  //
  // Responsibilities 1 and 3 mutate the `children` argument (and its descendants).
  static create(children: OutlineSyntaxNode[]): Document {
    // Unfortunately, this process of producing a ready-to-use Document has become a tad scattered.
    //
    // It needs to be revisited.

    // First, let's create our table of contents. It's up to each outline syntax node whether to allow
    // its descendants to be referenced by the table of contents. Some don't (e.g. blockquotes).
    const tableOfContents =
      Document.TableOfContents.createThenAssociateSectionLinksWithEntries(children)

    // Alright! We now have everything we need to produce our document!
    const document = new Document(children, tableOfContents)

    // Finally, if there are any footnotes, they still need their reference numbers, and they still
    // need to be extracted into blocks. Let's do it.
    insertFootnoteBlocksAndAssignFootnoteReferenceNumbers(document)

    // Whew. We're done!
    return document
  }

  constructor(children: OutlineSyntaxNode[], public tableOfContents = new Document.TableOfContents()) {
    super(children)
  }
}


export namespace Document {
  export class TableOfContents {
    // Returns a `TableOfContents` object with entries from `documentChildren`.
    //
    // If there are section links within `documentChildren`, they are associated with the
    // appropriate entries (mutating the section links).
    //
    // This methods also mutates the entries themselves, assigning them their table of contents
    // ordinals.
    static createThenAssociateSectionLinksWithEntries(documentChildren: OutlineSyntaxNode[]): TableOfContents {
      const entries = TableOfContents.getEntries(documentChildren)

      // Let's let each entry know its (1-based!) ordinal within the table of contents
      for (let i = 0; i < entries.length; i++) {
        entries[i].ordinalInTableOfContents = i + 1
      }

      const tableOfContents = new TableOfContents(entries)

      const allInlineSyntaxNodes = concat(
        documentChildren.map(child => child.inlineDescendants()))

      for (const inlineSyntaxNode of allInlineSyntaxNodes) {
        if (inlineSyntaxNode instanceof SectionLink) {
          inlineSyntaxNode.referenceMostAppropriateTableOfContentsEntry(tableOfContents)
        }
      }

      return tableOfContents
    }

    static getEntries(nodes: OutlineSyntaxNode[]): Heading[] {
      // Only headings can be table of contents entries.
      return concat(
        nodes.map(node =>
          node instanceof Heading ? [node] : node.descendantsToIncludeInTableOfContents()))
    }

    constructor(public entries: Heading[] = []) { }
  }
}
