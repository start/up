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
import { TextConsumer } from './TextConsumer'
import { getOutlineNodes } from './Outline/GetOutlineNodes'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { last } from './CollectionHelpers'


// =~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~
// TODO: Refactor tons of duplicate functionality
// =~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~



export function produceFootnoteBlocks(documentNode: DocumentNode): void {
  new FootnoteBlockProducer(documentNode)
}


class Sequence {
  public nextValue: number

  constructor(args: { start: number }) {
    this.nextValue = args.start
  }

  next(): number {
    return this.nextValue++
  }
}

// Here are the rules!
//
// 1. Any footnotes within a top-level outline convention (which naturally includes any footnotes within any nested
//    outline conventions) are placed into a footnote block directly following that top-level outline convention.
//    The only exception to this rule is blockquotes, because...
//
// 2. Blocknotes are considere mini-documents! Therefore, that first rule also applies to all top-level outline
//    conventions inside any blockquote.
//
// We'll use the term "blockless footnote" to describe a FootnoteNode that hasn't yet been placed ib a footnote block. 

class FootnoteBlockProducer {
  private footnoteReferenceNumberSequence = new Sequence({ start: 1 })

  constructor(documentNode: DocumentNode) {
    this.produceFootnoteBlocks(documentNode)
  }

  produceFootnoteBlocks(outlineNodeContainer: OutlineNodeContainer): void {
    const outlineNodesWithFootnoteBlocks: OutlineSyntaxNode[] = []

    for (const outlineNode of outlineNodeContainer.children) {
      outlineNodesWithFootnoteBlocks.push(outlineNode)

      const footnotes = this.processOutlineNodeAndGetFootnotesToPlaceInNextBlock(outlineNode)

      if (footnotes.length) {
        outlineNodesWithFootnoteBlocks.push(this.getFootnoteBlock(footnotes))
      }
    }

    outlineNodeContainer.children = outlineNodesWithFootnoteBlocks
  }

  processOutlineNodeAndGetFootnotesToPlaceInNextBlock(node: OutlineSyntaxNode): FootnoteNode[] {
    if ((node instanceof ParagraphNode) || (node instanceof HeadingNode)) {
      return this.getFootnotes(node.children)
    }

    if ((node instanceof UnorderedListNode) || (node instanceof OrderedListNode)) {
      return this.getBlocklessFootnotesFromOutlineContainers(node.listItems)
    }

    if (node instanceof LineBlockNode) {
      return this.getFootnotesFromInlineContainers(node.lines)
    }

    if (node instanceof DescriptionListNode) {
      return this.getBlocklessFootnotesFromDescriptionListItems(node.listItems)
    }

    if (node instanceof BlockquoteNode) {
      this.produceFootnoteBlocks(node)
      
      // Footnotes within a blockquote produce footnote blocks inside of that blockquote. We won't need to worry
      // about placing any in the next footnote block.
      return []
    }

    return []
  }

  getFootnotes(inlineNodes: InlineSyntaxNode[]): FootnoteNode[] {
    const footnotes: FootnoteNode[] = []

    for (let i = 0; i < inlineNodes.length; i++) {
      const node = inlineNodes[i]

      if (node instanceof FootnoteNode) {
        node.referenceNumber = this.footnoteReferenceNumberSequence.next()
        footnotes.push(node)
      }
    }

    return footnotes
  }

  getBlocklessFootnotesFromOutlineContainers(containers: OutlineNodeContainer[]): FootnoteNode[] {
    const footnotes: FootnoteNode[] = []

    for (const container of containers) {
      const footnotesForThisContainer = this.processOutlineNodesAndGetFootnotesForNextBlock(container.children)

      footnotes.push(...footnotesForThisContainer)
    }

    return footnotes
  }

  getFootnotesFromInlineContainers(inlineContainers: InlineNodeContainer[]): FootnoteNode[] {
    const footnotes: FootnoteNode[] = []

    for (const container of inlineContainers) {
      const containerFootnotes = this.getFootnotes(container.children)

      footnotes.push(...containerFootnotes)
    }

    return footnotes
  }

  getFootnoteBlock(footnotes: FootnoteNode[]): FootnoteBlockNode {
    // It's contrived, but footnotes can reference other footnotes.
    //
    // For example:
    //
    // Me? I'm totally normal. ((That said, I don't eat cereal. ((Well, I do, but I pretend not to.)) Never have.)) Really.
    //
    // The nesting can be arbitrarily deep.
    //
    // Any nested footnotes are added to end of the footnote block, after all of the original footnotes. Then, any (doubly)
    // nested footnotes inside of *those* footnotes are added to the end, and the process repeats until no more nested
    // footnotes are found.

    const block = new FootnoteBlockNode(footnotes)

    for (let footnoteIndex = 0; footnoteIndex < block.footnoteReferences.length; footnoteIndex++) {
      const footnote = block.footnoteReferences[footnoteIndex]

      const nestedFootnotes = this.getFootnotes(footnote.children)

      block.footnoteReferences.push(...nestedFootnotes)
    }

    return block
  }

  processOutlineNodesAndGetFootnotesForNextBlock(outlineNodes: OutlineSyntaxNode[]): FootnoteNode[] {
    const footnotes: FootnoteNode[] = []

    for (const outlineNode of outlineNodes) {
      const footnotesForThisNode = this.processOutlineNodeAndGetFootnotesToPlaceInNextBlock(outlineNode)

      footnotes.push(...footnotesForThisNode)
    }

    return footnotes
  }

  getBlocklessFootnotesFromDescriptionListItems(listItems: DescriptionListItem[]): FootnoteNode[] {
    const footnotes: FootnoteNode[] = []

    for (const listItem of listItems) {
      const footnotesForTerms = this.getFootnotesFromInlineContainers(listItem.terms)
      footnotes.push(...footnotesForTerms)

      const descriptionResult = this.processOutlineNodesAndGetFootnotesForNextBlock(listItem.description.children)
      footnotes.push(...descriptionResult)
    }

    return footnotes
  }
}


interface OutlineNodeContainer {
  children: OutlineSyntaxNode[]
}


interface InlineNodeContainer {
  children: InlineSyntaxNode[]
}