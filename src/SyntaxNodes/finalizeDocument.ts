import { concat } from '../CollectionHelpers'
import { OutlineSyntaxNodeContainer } from '../SyntaxNodes/OutlineSyntaxNodeContainer'
import { InlineSyntaxNodeContainer } from '../SyntaxNodes/InlineSyntaxNodeContainer'
import { Blockquote } from '../SyntaxNodes/Blockquote'
import { DescriptionList } from '../SyntaxNodes/DescriptionList'
import { UpDocument } from '../SyntaxNodes/UpDocument'
import { FootnoteBlock } from '../SyntaxNodes/FootnoteBlock'
import { Footnote } from '../SyntaxNodes/Footnote'
import { Heading } from '../SyntaxNodes/Heading'
import { InlineSyntaxNode } from '../SyntaxNodes/InlineSyntaxNode'
import { RichInlineSyntaxNode } from '../SyntaxNodes/RichInlineSyntaxNode'
import { LineBlock } from '../SyntaxNodes/LineBlock'
import { OrderedList } from '../SyntaxNodes/OrderedList'
import { OutlineSyntaxNode } from '../SyntaxNodes/OutlineSyntaxNode'
import { Paragraph } from '../SyntaxNodes/Paragraph'
import { UnorderedList } from '../SyntaxNodes/UnorderedList'
import { SpoilerBlock } from '../SyntaxNodes/SpoilerBlock'
import { NsfwBlock } from '../SyntaxNodes/NsfwBlock'
import { NsflBlock } from '../SyntaxNodes/NsflBlock'
import { Table } from '../SyntaxNodes/Table'
//import { ReferenceToTableOfContentsEntry } from '../SyntaxNodes/ReferenceToTableOfContentsEntry'


// This function is responsible for:
//
// * Assigning footnote reference numbers
// * Producing footnote blocks
// * Matching references to table of contents entries... with table of contents entries 
//
//
// Rules for references to table of contents entries
// =================================================
//
// Each reference has a `entryTextSnippet` field. A given reference is matched with the first entry whose
// whose text equals `entryTextSnippet`. If there are no exact matches, the reference will be associated
// with the first entry whose text *contains* `entryTextSnippet`.
//
// The "text" of an entry refers to the actual text content of the entry. For example, if an entry was
// originally produced by the following markup:
//
//    Why you should *never* use the `<font>` element
//    -----------------------------------------------
//
// ... Then its text would be:
//
//    Why you should never use the <font> element
//
//
// Rules for footnotes
// ===================
//
// The rules for footnotes are more complicated.
//
// Footnotes are written inline, but they aren't meant to appear inline in the final document. That would
// defeat the purpose of footnotes! Instead, footnotes are extracted and placed in footnote blocks.
// 
// Right now, Up only supports one output format: HTML. In the HTML output format, the original inline
// footnote is replaced by its reference number, which links to the content of the footnote in the
// appropriate footnote block. If you're ever seen a Wikipedia article, you're familiar with this setup.
// Future output formats might handle footnotes slightly differently, but they should all use a similar
// strategy.
//
// The specific footnote rules are below:
//
//
// 1. Any footnotes within a top-level outline convention are placed into a footnote block directly following
//    that top-level outline convention. Even if a footnote is inside a paragraph inside an ordered list
//    inside a description list, it's placed into a block after the description list, because the description
//    list is the outermost, top-level outline convention.
//
// 2. Rule 1 applies to all outline conventions except:
//
//     * Blockquotes
//       -----------
//
//      Blockquotes are considered mini-documents! Therefore, footnotes inside a blockquote are placed into a
//      footnote block inside the blockquote, and rule 1 is applied to all top-level outline conventions
//      within the blockquote. In other words, a footnote inside a paragraph inside an ordered list inside a
//      blockquote is placed into a footnote block after the ordered list, but still inside the blockquote,
//      because the ordered list is the outermost, top-level convention within the blockquote.
//
//     * Spoiler blocks, NSFW blocks, and NSFL blocks
//       --------------------------------------------
//
//      These conventions shouldn't "leak" any of their content, so they have the same footnote block rules
//      as blockquotes.
//
// 3. It's contrived, but footnotes can reference other footnotes. For example:
//
//    I'm normal. [^That said, I don't eat cereal. (^Well, I do, but I pretend not to.) Never have.] Really.
//
//    The nesting can be arbitrarily deep.
//
//    Any nested footnotes are added to end of the footnote block containing the outer footnote, after any
//    other non-nested footnotes. Then, any (doubly) nested footnotes inside the nested footnotes are added
//    to the end of that same footnote block, and the process repeats until no more nested footnotes are
//    found.
//
// 4. Footnotes are assigned reference numbers based on the order those footnotes are referenced in the final
//    document.
//
//    Due to rule 3, a nested footnote (one that is referenced by another footnote) isn't actually referenced
//    in the final document until its footnote block. As a result, that nested footnote is assigned a
//    reference number after any non-nested footnotes appearing in the same top-level outline convention,
//    because those footnotes are referenced inside the outline convention itself (and the footnote block
//    comes after the outline convention).
//
//
// Oh, one last thing! We'll use the term "blockless footnote" to describe a Footnote that hasn't yet been
// placed in a footnote block.
export function finalizeDocument(document: UpDocument): void {
  new FootnoteBlockInserter(document)
}


class FootnoteBlockInserter {
  private currentFootnoteReferenceNumber = 1

  constructor(document: UpDocument) {
    this.finalizeDocument(document)
  }

  finalizeDocument(outlineNodeContainer: OutlineSyntaxNodeContainer): void {
    const outlineNodesWithFootnoteBlocks: OutlineSyntaxNode[] = []

    for (const outlineNode of outlineNodeContainer.children) {
      outlineNodesWithFootnoteBlocks.push(outlineNode)

      const footnotesForNextFootnoteBlock =
        this.handleOutlineNodeAndGetBlocklessFootnotes(outlineNode)

      if (footnotesForNextFootnoteBlock.length) {
        outlineNodesWithFootnoteBlocks.push(this.getFootnoteBlock(footnotesForNextFootnoteBlock))
      }
    }

    outlineNodeContainer.children = outlineNodesWithFootnoteBlocks
  }

  // TODO: Consider moving this process to the individual outline syntax node classes.
  handleOutlineNodeAndGetBlocklessFootnotes(node: OutlineSyntaxNode): Footnote[] {
    if ((node instanceof Paragraph) || (node instanceof Heading)) {
      return this.getOutermostFootnotesAndAssignTheirReferenceNumbers(node.children)
    }

    if (node instanceof LineBlock) {
      return this.getBlocklessFootnotesFromInlineContainers(node.lines)
    }

    if ((node instanceof Blockquote) || (node instanceof SpoilerBlock) || (node instanceof NsfwBlock) || (node instanceof NsflBlock)) {
      this.finalizeDocument(node)

      // We've just handled all the footnotes within the outline convention. None of them are blockless!
      return []
    }

    if ((node instanceof UnorderedList) || (node instanceof OrderedList)) {
      return this.getBlocklessFootnotesFromOutlineContainers(node.items)
    }

    if (node instanceof DescriptionList) {
      return this.getBlocklessFootnotesFromDescriptionList(node)
    }

    if (node instanceof Table) {
      return this.getBlocklessFootnotesFromTable(node)
    }

    return []
  }

  // Here, "outermost footnote" refers to any footnote that isn't nested within another footnote. It does not
  // exclude footntoes nested within other inline conventions (e.g. emphasis or stress).
  //
  // Because of rule 4 (described above), the reference numbers of nested footnotes aren't assigned until we
  // produce their containing footnote blocks.
  getOutermostFootnotesAndAssignTheirReferenceNumbers(nodes: InlineSyntaxNode[]): Footnote[] {
    const footnotes: Footnote[] = []

    for (const node of nodes) {
      if (node instanceof Footnote) {
        node.referenceNumber = this.currentFootnoteReferenceNumber++
        footnotes.push(node)
        continue
      }

      if (node instanceof RichInlineSyntaxNode) {
        footnotes.push(
          ...this.getOutermostFootnotesAndAssignTheirReferenceNumbers(node.children))
      }
    }

    return footnotes
  }

  getBlocklessFootnotesFromInlineContainers(containers: InlineSyntaxNodeContainer[]): Footnote[] {
    return concat(
      containers.map(container => this.getOutermostFootnotesAndAssignTheirReferenceNumbers(container.children)))
  }

  getBlocklessFootnotesFromOutlineContainers(containers: OutlineSyntaxNodeContainer[]): Footnote[] {
    return concat(
      containers.map(container => this.getBlocklessFootnotesFromOutlineNodes(container.children)))
  }

  getBlocklessFootnotesFromDescriptionList(list: DescriptionList): Footnote[] {
    return concat(
      list.items.map(item => this.getBlocklessFootnotesFromDescriptionListItem(item)))
  }

  getBlocklessFootnotesFromDescriptionListItem(item: DescriptionList.Item): Footnote[] {
    const footnotesFromTerms =
      this.getBlocklessFootnotesFromInlineContainers(item.terms)

    const footnotesFromDescription =
      this.getBlocklessFootnotesFromOutlineNodes(item.description.children)

    return footnotesFromTerms.concat(footnotesFromDescription)
  }

  getBlocklessFootnotesFromTable(table: Table): Footnote[] {
    return concat([
      table.caption ? [table.caption] : [],
      table.header.cells,
      ...table.rows.map(row => row.cellsStartingWithRowHeaderCell)
    ].map(inlineContainer => this.getBlocklessFootnotesFromInlineContainers(inlineContainer)))
  }

  getBlocklessFootnotesFromOutlineNodes(nodes: OutlineSyntaxNode[]): Footnote[] {
    return concat(
      nodes.map(node => this.handleOutlineNodeAndGetBlocklessFootnotes(node)))
  }

  getFootnoteBlock(footnotes: Footnote[]): FootnoteBlock {
    const footnoteBlock = new FootnoteBlock(footnotes)

    for (let i = 0; i < footnoteBlock.footnotes.length; i++) {
      const footnote = footnoteBlock.footnotes[i]

      const nestedFootnotes =
        this.getOutermostFootnotesAndAssignTheirReferenceNumbers(footnote.children)

      // Note: This appends items to the collection we're currently looping through.
      footnoteBlock.footnotes.push(...nestedFootnotes)
    }

    return footnoteBlock
  }
}
