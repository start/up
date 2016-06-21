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


// Here are the rules!
//
// 1. Any footnotes within a top-level outline convention (which includes any footnotes within any nested
//    outline conventions) are placed into a footnote block directly following that top-level outline
//    convention. Blockquotes are the exception to this rule, because...
//
// 2. Blocknotes are considered mini-documents! Therefore, that first rule is applied to all top-level outline
//    conventions inside any blockquote. In other words, footnotes inside a paragraph inside a blockquote are
//    placed into a footnote block after the paragraph but still inside the blockquote.
//
// 3. It's contrived, but footnotes can reference other footnotes. For example:
//
//    I'm normal. ((That said, I don't eat cereal. ((Well, I do, but I pretend not to.)) Never have.)) Really.
//
//    The nesting can be arbitrarily deep.
//
//    Any nested footnotes are added to end of the footnote block containing the outer footnote, after all of
//    the non-nested footnotes. Then, any (doubly) nested footnotes inside of *those* footnotes are added to
//    the end of that same footnote block, and the process repeats until no more nested footnotes are found.
//
// 4. Footnote reference numbers are assigned sequentially, based on the order the reference numbers would be
//    *read* in the final document.
//
// We'll use the term "blockless footnote" to describe a FootnoteNode that hasn't yet been placed in a footnote
// block.


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
