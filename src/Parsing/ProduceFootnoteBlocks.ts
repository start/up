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

      const outlineNodeResult = this.processFootnotes(outlineNode)

      if (outlineNodeResult.footnotesToPlaceInNextBlock.length) {
        outlineNodesWithFootnotes.push(
          this.getFootnoteBlockAndProcessNestedFootnotes(outlineNodeResult.footnotesToPlaceInNextBlock))
      }
    }

    outlineNodeContainer.children = outlineNodesWithFootnotes
  }

  processFootnotes(node: OutlineSyntaxNode): ProcessOutlineContainerFootnotesResult {
    if ((node instanceof ParagraphNode) || (node instanceof HeadingNode)) {
      return new ProcessOutlineContainerFootnotesResult({
        footnotesToPlaceInNextBlock: this.setFootnoteReferenceNumbersAndGetFootnotes(node.children)
      })
    }

    if ((node instanceof UnorderedListNode) || (node instanceof OrderedListNode)) {
      return this.processOutlineContainersFootnotes(node.listItems)
    }

    if (node instanceof LineBlockNode) {
      return new ProcessOutlineContainerFootnotesResult({
        footnotesToPlaceInNextBlock: this.replaceInlineContainersPotentialReferencesAndGetFootnotes(node.lines)
      })
    }

    if (node instanceof DescriptionListNode) {
      return this.processDescriptionListItemFootnotes(node.listItems)
    }

    if (node instanceof BlockquoteNode) {
      this.produceFootnoteBlocks(node)
      return new ProcessOutlineContainerFootnotesResult()
    }

    return new ProcessOutlineContainerFootnotesResult()
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

  processOutlineContainersFootnotes(containers: OutlineNodeContainer[]): ProcessOutlineContainerFootnotesResult {
    const result = new ProcessOutlineContainerFootnotesResult()

    for (const container of containers) {
      const resultForThisOutlineContainer = this.processFootnotesForOutlineNodes(container.children)

      result.include(resultForThisOutlineContainer)
    }

    return result
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

  processFootnotesForOutlineNodes(outlineNodes: OutlineSyntaxNode[]): ProcessOutlineContainerFootnotesResult {
    const result = new ProcessOutlineContainerFootnotesResult()

    for (const outlineNode of outlineNodes) {
      const outlineNodeResult = this.processFootnotes(outlineNode)

      result.include(outlineNodeResult)
    }

    return result
  }

  processDescriptionListItemFootnotes(listItems: DescriptionListItem[]): ProcessOutlineContainerFootnotesResult {
    const result = new ProcessOutlineContainerFootnotesResult()

    for (const listItem of listItems) {
      const footnotesForTerms = this.replaceInlineContainersPotentialReferencesAndGetFootnotes(listItem.terms)
      result.includeFootnotesToPlaceInNextBlock(footnotesForTerms)

      const descriptionResult = this.processFootnotesForOutlineNodes(listItem.description.children)
      result.include(descriptionResult)
    }

    return result
  }
}


interface ProcessOutlineContainerFootnotesResultArgs {
  footnotesToPlaceInNextBlock?: FootnoteNode[]
}

class ProcessOutlineContainerFootnotesResult {
  public footnotesToPlaceInNextBlock: FootnoteNode[]

  constructor(args?: ProcessOutlineContainerFootnotesResultArgs) {
    if (args) {
      this.footnotesToPlaceInNextBlock = args.footnotesToPlaceInNextBlock
    }

    this.footnotesToPlaceInNextBlock = this.footnotesToPlaceInNextBlock || []
  }

  includeFootnotesToPlaceInNextBlock(footnotes: FootnoteNode[]): void {
    this.footnotesToPlaceInNextBlock = this.footnotesToPlaceInNextBlock.concat(footnotes)
  }

  include(other: ProcessOutlineContainerFootnotesResult): void {
    this.includeFootnotesToPlaceInNextBlock(other.footnotesToPlaceInNextBlock)
  }
}



interface OutlineNodeContainer {
  children: OutlineSyntaxNode[]
}


interface InlineNodeContainer {
  children: InlineSyntaxNode[]
}