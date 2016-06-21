import { SectionSeparatorNode } from '../SyntaxNodes/SectionSeparatorNode'
import { OutlineSyntaxNode } from '../SyntaxNodes/OutlineSyntaxNode'
import { InlineSyntaxNode } from '../SyntaxNodes/InlineSyntaxNode'
import { ParagraphNode } from '../SyntaxNodes/ParagraphNode'
import { BlockquoteNode } from '../SyntaxNodes/BlockquoteNode'
import { LineBlockNode } from '../SyntaxNodes/LineBlockNode'
import { HeadingNode } from '../SyntaxNodes/HeadingNode'
import { UnorderedListNode } from '../SyntaxNodes/UnorderedListNode'
import { OrderedListNode } from '../SyntaxNodes/OrderedListNode'
import { DescriptionListNode } from '../SyntaxNodes/DescriptionListNode'
import { DescriptionListItem } from '../SyntaxNodes/DescriptionListItem'
import { FootnoteNode } from '../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../SyntaxNodes/FootnoteBlockNode'
import { getOutlineNodes } from '../Parsing/Outline/getOutlineNodes'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { concat } from '../CollectionHelpers'


// Footnotes are written inline, but they aren't meant to appear inline in the final document. That would
// defeat the whole purpose of footnotes! Instead, footnotes are extracted and placed in footnote blocks.
//
// Right now, Up only supports one output format: HTML. In the HTML output format, the original inline
// footnote is replaced by its reference number, which links to the content of the footnote in the
// appropriate footnote block. If you're ever seen a Wikipedia article, you're familiar with this setup.
// Future output formats might handle footnotes slightly differently, but they should all use a similar
// strategy.
//
// Here are the specific rules for footnote blocks and reference numbers: 
//
//
// 1. Any footnotes within a top-level outline convention are placed into a footnote block directly following
//    that top-level outline convention. Even if the footnote is inside a paragraph inside an unordered list
//    inside an ordered list, it's still placed into a block after the ordered list, because the ordered list
//    is the outermost, top-level convention.
//
//    Blockquotes are the exception to this rule, because...
//
// 2. Blockquotes are considered mini-documents! Therefore, that first rule is applied to all top-level outline
//    conventions inside any blockquote. In other words, a footnote inside a paragraph inside a blockquote is
//    placed into a footnote block after the paragraph, but still inside the blockquote. Phew.
//
// 3. It's contrived, but footnotes can reference other footnotes. For example:
//
//    I'm normal. ((That said, I don't eat cereal. [[Well, I do, but I pretend not to.]] Never have.)) Really.
//
//    The nesting can be arbitrarily deep.
//
//    Any nested footnotes are added to end of the footnote block containing the outer footnote, after any
//    other non-nested footnotes. Then, any (doubly) nested footnotes inside of *those* footnotes are added to
//    the end of that same footnote block, and the process repeats until no more nested footnotes are found.
//
// 4. Footnotes are assigned reference numbers based on the order those footnotes are referenced in the final
//    document.
//
//    Due to rule 3 (above), a nested footnote (one that is referenced by another footnote) isn't actually
//    referenced in the final document until its footnote block. As a result, that nested footnote is assigned
//    a reference number after any non-nested footnote appearing in the same top-level outline convention,
//    because those footnotes are referenced inside the outline convention itself.
//
//
// Oh, one last thing! We'll use the term "blockless footnote" to describe a FootnoteNode that hasn't yet been
// placed in a footnote block.


export function insertFootnoteBlocks(documentNode: DocumentNode): void {
  new FootnoteBlockInserter(documentNode)
}


class FootnoteBlockInserter {
  private currentFootnoteReferenceNumber = 1

  constructor(documentNode: DocumentNode) {
    this.produceFootnoteBlocks(documentNode)
  }

  produceFootnoteBlocks(outlineNodeContainer: OutlineNodeContainer): void {
    const outlineNodesWithFootnoteBlocks: OutlineSyntaxNode[] = []

    for (const outlineNode of outlineNodeContainer.children) {
      outlineNodesWithFootnoteBlocks.push(outlineNode)

      const footnotesForNextFootnoteBlock =
        this.getBlocklessFootnotes(outlineNode)

      if (footnotesForNextFootnoteBlock.length) {
        outlineNodesWithFootnoteBlocks.push(this.getFootnoteBlock(footnotesForNextFootnoteBlock))
      }
    }

    outlineNodeContainer.children = outlineNodesWithFootnoteBlocks
  }

  getBlocklessFootnotes(node: OutlineSyntaxNode): FootnoteNode[] {
    if ((node instanceof ParagraphNode) || (node instanceof HeadingNode)) {
      return this.getFootnotesAndAssignReferenceNumbers(node.children)
    }

    if (node instanceof LineBlockNode) {
      return this.getFootnotesFromInlineContainers(node.lines)
    }

    if ((node instanceof UnorderedListNode) || (node instanceof OrderedListNode)) {
      return this.getBlocklessFootnotesFromOutlineContainers(node.listItems)
    }

    if (node instanceof DescriptionListNode) {
      return this.getBlocklessFootnotesFromDescriptionList(node)
    }

    if (node instanceof BlockquoteNode) {
      this.produceFootnoteBlocks(node)

      // Footnotes within a blockquote produce footnote blocks inside of that blockquote. We won't need to worry
      // about placing any in the next footnote block.
      return []
    }

    return []
  }

  getFootnotesAndAssignReferenceNumbers(nodes: InlineSyntaxNode[]): FootnoteNode[] {
    const footnotes: FootnoteNode[] = []

    for (const node of nodes) {
      if (node instanceof FootnoteNode) {
        node.referenceNumber = this.currentFootnoteReferenceNumber++
        footnotes.push(node)
      }
    }

    return footnotes
  }

  getFootnotesFromInlineContainers(containers: InlineNodeContainer[]): FootnoteNode[] {
    return concat(
      containers.map(container => this.getFootnotesAndAssignReferenceNumbers(container.children)))
  }

  getBlocklessFootnotesFromOutlineContainers(containers: OutlineNodeContainer[]): FootnoteNode[] {
    return concat(
      containers.map(container => this.getBlocklessFootnotesFromOutlineNodes(container.children)))
  }

  getBlocklessFootnotesFromDescriptionList(list: DescriptionListNode): FootnoteNode[] {
    return concat(
      list.listItems.map(item => this.getBlocklessFootnotesFromDescriptionListItem(item)))
  }

  getBlocklessFootnotesFromDescriptionListItem(item: DescriptionListItem): FootnoteNode[] {
    const footnotesFromTerms =
      this.getFootnotesFromInlineContainers(item.terms)

    const footnotesFromDescription =
      this.getBlocklessFootnotesFromOutlineNodes(item.description.children)

    return footnotesFromTerms.concat(footnotesFromDescription)
  }

  getBlocklessFootnotesFromOutlineNodes(nodes: OutlineSyntaxNode[]): FootnoteNode[] {
    return concat(
      nodes.map(node => this.getBlocklessFootnotes(node)))
  }

  getFootnoteBlock(footnotes: FootnoteNode[]): FootnoteBlockNode {
    const footnoteBlock = new FootnoteBlockNode(footnotes)

    for (let i = 0; i < footnoteBlock.footnotes.length; i++) {
      const footnote = footnoteBlock.footnotes[i]
      const innerFootnotes = this.getFootnotesAndAssignReferenceNumbers(footnote.children)

      // Note: This appends items to the collection we're currently looping through.
      footnoteBlock.footnotes.push(...innerFootnotes)
    }

    return footnoteBlock
  }
}


export interface OutlineNodeContainer {
  children: OutlineSyntaxNode[]
}

export interface InlineNodeContainer {
  children: InlineSyntaxNode[]
}
