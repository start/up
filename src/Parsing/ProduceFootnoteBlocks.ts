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


class FootnoteBlockProducer {
  private footnoteReferenceNumberSequence = new Sequence({ start: 1 })

  constructor(documentNode: DocumentNode) {
    this.produceFootnoteBlocks(documentNode)
  }

  produceFootnoteBlocks(outlineNodeContainer: OutlineNodeContainer): void {
    const outlineNodesWithFootnotes: OutlineSyntaxNode[] = []

    for (const outlineNode of outlineNodeContainer.children) {
      outlineNodesWithFootnotes.push(outlineNode)

      const footnotes = this.processOutlineNodeAndGetFootnotesToPlaceInNextBlock(outlineNode)

      if (footnotes.length) {
        outlineNodesWithFootnotes.push(
          this.getFootnoteBlockAndProcessNestedFootnotes(footnotes))
      }
    }

    outlineNodeContainer.children = outlineNodesWithFootnotes
  }

  processOutlineNodeAndGetFootnotesToPlaceInNextBlock(node: OutlineSyntaxNode): FootnoteNode[] {
    if ((node instanceof ParagraphNode) || (node instanceof HeadingNode)) {
      return this.setFootnoteReferenceNumbersAndGetFootnotes(node.children)
    }

    if ((node instanceof UnorderedListNode) || (node instanceof OrderedListNode)) {
      return this.processOutlineContainersAndGetFootnotesToPlaceInNextBlock(node.listItems)
    }

    if (node instanceof LineBlockNode) {
      return this.replaceInlineContainersPotentialReferencesAndGetFootnotes(node.lines)
    }

    if (node instanceof DescriptionListNode) {
      return this.processDescriptionListItemsAndGetFootnotesForNextBlock(node.listItems)
    }

    if (node instanceof BlockquoteNode) {
      this.produceFootnoteBlocks(node)
      return []
    }

    return []
  }

  setFootnoteReferenceNumbersAndGetFootnotes(inlineNodes: InlineSyntaxNode[]): FootnoteNode[] {
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

  processOutlineContainersAndGetFootnotesToPlaceInNextBlock(containers: OutlineNodeContainer[]): FootnoteNode[] {
    const footnotes: FootnoteNode[] = []

    for (const container of containers) {
      const footnotesForThisContainer = this.processOutlineNodesAndGetFootnotesForNextBlock(container.children)

      footnotes.push(...footnotesForThisContainer)
    }

    return footnotes
  }

  replaceInlineContainersPotentialReferencesAndGetFootnotes(inlineContainers: InlineNodeContainer[]): FootnoteNode[] {
    const footnotes: FootnoteNode[] = []

    for (const container of inlineContainers) {
      const containerFootnotes = this.setFootnoteReferenceNumbersAndGetFootnotes(container.children)

      footnotes.push(...containerFootnotes)
    }

    return footnotes
  }

  getFootnoteBlockAndProcessNestedFootnotes(footnotes: FootnoteNode[]): FootnoteBlockNode {
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

      const nestedFootnotes =
        this.setFootnoteReferenceNumbersAndGetFootnotes(footnote.children)

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

  processDescriptionListItemsAndGetFootnotesForNextBlock(listItems: DescriptionListItem[]): FootnoteNode[] {
    const footnotes: FootnoteNode[] = []

    for (const listItem of listItems) {
      const footnotesForTerms = this.replaceInlineContainersPotentialReferencesAndGetFootnotes(listItem.terms)
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