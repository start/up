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
import { PlaceholderFootnoteReferenceNode } from '../SyntaxNodes/PlaceholderFootnoteReferenceNode'
import { Footnote } from '../SyntaxNodes/Footnote'
import { FootnoteReferenceNode } from '../SyntaxNodes/FootnoteReferenceNode'
import { FootnoteBlockNode } from '../SyntaxNodes/FootnoteBlockNode'
import { TextConsumer } from './TextConsumer'
import { getOutlineNodes } from './Outline/GetOutlineNodes'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { last } from './CollectionHelpers'


// =~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~
// TODO: Refactor tons of duplicate functionality
// =~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~

export function applyFootnotes(documentNode: DocumentNode): void {  
  const initialFootnoteReferenceNumber = 1
  
  produceFootnoteBlocksAndGetFootnoteCount(documentNode, initialFootnoteReferenceNumber)
}

function produceFootnoteBlocksAndGetFootnoteCount(outlineNodeContainer: OutlineNodeContainer, nextFootnoteReferenceNumber: number): number {
  const originalFootnoteReferenceOrdinal = nextFootnoteReferenceNumber
  const outlineNodesWithFootnotes: OutlineSyntaxNode[] = []

  for (const outlineNode of outlineNodeContainer.children) {
    outlineNodesWithFootnotes.push(outlineNode)

    const outlineNodeResult = processFootnotes(outlineNode, nextFootnoteReferenceNumber)

    if (outlineNodeResult.footnotesToPlaceInNextBlock.length) {
      outlineNodesWithFootnotes.push(
        getFootnoteBlockAndProcessNestedReferences(outlineNodeResult.footnotesToPlaceInNextBlock))
    }

    nextFootnoteReferenceNumber += outlineNodeResult.counAlltFootnotes()
  }

  outlineNodeContainer.children = outlineNodesWithFootnotes

  return nextFootnoteReferenceNumber - originalFootnoteReferenceOrdinal
}


interface ProcessOutlineContainerFootnotesResultArgs {
  footnotesToPlaceInNextBlock?: Footnote[]
  countFootnotesInBlockquotes?: number
}


class ProcessOutlineContainerFootnotesResult {
  public footnotesToPlaceInNextBlock: Footnote[]
  private countFootnotesInBlockquotes: number

  constructor(args?: ProcessOutlineContainerFootnotesResultArgs) {
    if (args) {
      this.footnotesToPlaceInNextBlock = args.footnotesToPlaceInNextBlock
      this.countFootnotesInBlockquotes = args.countFootnotesInBlockquotes
    }

    this.footnotesToPlaceInNextBlock = this.footnotesToPlaceInNextBlock || []
    this.countFootnotesInBlockquotes = this.countFootnotesInBlockquotes || 0
  }

  counAlltFootnotes(): number {
    return this.footnotesToPlaceInNextBlock.length + this.countFootnotesInBlockquotes
  }

  includeCountFootnotesInBlockquotes(count: number): void {
    this.countFootnotesInBlockquotes += count
  }

  includeFootnotesToPlaceInNextBlock(footnotes: Footnote[]): void {
    this.footnotesToPlaceInNextBlock = this.footnotesToPlaceInNextBlock.concat(footnotes)
  }

  include(other: ProcessOutlineContainerFootnotesResult): void {
    this.includeFootnotesToPlaceInNextBlock(other.footnotesToPlaceInNextBlock)
    this.includeCountFootnotesInBlockquotes(other.countFootnotesInBlockquotes)
  }
}


function processFootnotesForOutlineNodes(outlineNodes: OutlineSyntaxNode[], nextFootnoteReferenceNumber: number): ProcessOutlineContainerFootnotesResult {
  const result = new ProcessOutlineContainerFootnotesResult()

  for (const outlineNode of outlineNodes) {
    const outlineNodeResult = processFootnotes(outlineNode, nextFootnoteReferenceNumber)

    nextFootnoteReferenceNumber += outlineNodeResult.counAlltFootnotes()
    result.include(outlineNodeResult)
  }

  return result
}


function processFootnotes(node: OutlineSyntaxNode, nextFootnoteReferenceNumber: number): ProcessOutlineContainerFootnotesResult {
  if ((node instanceof ParagraphNode) || (node instanceof HeadingNode)) {
    return new ProcessOutlineContainerFootnotesResult({
      footnotesToPlaceInNextBlock: replacePotentialReferencesAndGetFootnotes(node.children, nextFootnoteReferenceNumber)
    })
  }

  if ((node instanceof UnorderedListNode) || (node instanceof OrderedListNode)) {
    return processOutlineContainersFootnotes(node.listItems, nextFootnoteReferenceNumber)
  }

  if (node instanceof LineBlockNode) {
    return new ProcessOutlineContainerFootnotesResult({
      footnotesToPlaceInNextBlock: replaceInlineContainersPotentialReferencesAndGetFootnotes(node.lines, nextFootnoteReferenceNumber)
    })
  }

  if (node instanceof DescriptionListNode) {
    return processDescriptionListItemFootnotes(node.listItems, nextFootnoteReferenceNumber)
  }

  if (node instanceof BlockquoteNode) {
    return new ProcessOutlineContainerFootnotesResult({
      countFootnotesInBlockquotes: produceFootnoteBlocksAndGetFootnoteCount(node, nextFootnoteReferenceNumber)
    })
  }

  return new ProcessOutlineContainerFootnotesResult()
}


interface OutlineNodeContainer {
  children: OutlineSyntaxNode[]
}


interface InlineNodeContainer {
  children: InlineSyntaxNode[]
}


function processOutlineContainersFootnotes(containers: OutlineNodeContainer[], nextFootnoteReferenceNumber: number): ProcessOutlineContainerFootnotesResult {
  const result = new ProcessOutlineContainerFootnotesResult()

  for (const container of containers) {
    const resultForThisOutlineContainer = processFootnotesForOutlineNodes(container.children, nextFootnoteReferenceNumber)

    nextFootnoteReferenceNumber += resultForThisOutlineContainer.counAlltFootnotes()
    result.include(resultForThisOutlineContainer)
  }

  return result
}


function processDescriptionListItemFootnotes(listItems: DescriptionListItem[], nextFootnoteReferenceNumber: number): ProcessOutlineContainerFootnotesResult {
  const result = new ProcessOutlineContainerFootnotesResult()

  for (const listItem of listItems) {
    const footnotesForTerms = replaceInlineContainersPotentialReferencesAndGetFootnotes(listItem.terms, nextFootnoteReferenceNumber)

    result.includeFootnotesToPlaceInNextBlock(footnotesForTerms)
    nextFootnoteReferenceNumber += footnotesForTerms.length

    const descriptionResult = processFootnotesForOutlineNodes(listItem.description.children, nextFootnoteReferenceNumber)

    nextFootnoteReferenceNumber += descriptionResult.counAlltFootnotes()
    result.include(descriptionResult)
  }

  return result
}


function replaceInlineContainersPotentialReferencesAndGetFootnotes(inlineContainers: InlineNodeContainer[], nextFootnoteReferenceNumber: number): Footnote[] {
  const footnotes: Footnote[] = []

  for (const container of inlineContainers) {
    const containerFootnotes = replacePotentialReferencesAndGetFootnotes(container.children, nextFootnoteReferenceNumber)

    footnotes.push(...containerFootnotes)
    nextFootnoteReferenceNumber += containerFootnotes.length
  }

  return footnotes
}


// This function mutates the `inlineNodes` array, replacing any of its `PlaceholderFootnoteReferenceNodes`
// with `FootnoteReferenceNodes`.
//
// It returns a collection of `Footnotes`, each of which contain the contents of the corresponding
// (replaced) `PlaceholderFootnoteReferenceNode`.
function replacePotentialReferencesAndGetFootnotes(inlineNodes: InlineSyntaxNode[], nextFootnoteReferenceNumber: number): Footnote[] {
  const footnotes: Footnote[] = []

  for (let i = 0; i < inlineNodes.length; i++) {
    const node = inlineNodes[i]

    if (node instanceof PlaceholderFootnoteReferenceNode) {
      footnotes.push(new Footnote(node.children, nextFootnoteReferenceNumber))
      inlineNodes[i] = new FootnoteReferenceNode(nextFootnoteReferenceNumber)
      nextFootnoteReferenceNumber += 1
    }
  }

  return footnotes
}


function getFootnoteBlockAndProcessNestedReferences(footnotes: Footnote[]): FootnoteBlockNode {
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

  let nextFootnoteReferenceNumber = last(block.footnotes).referenceNumber + 1

  for (let footnoteIndex = 0; footnoteIndex < block.footnotes.length; footnoteIndex++) {
    const footnote = block.footnotes[footnoteIndex]

    const nestedFootnotes =
      replacePotentialReferencesAndGetFootnotes(footnote.children, nextFootnoteReferenceNumber)

    block.footnotes.push(...nestedFootnotes)
    nextFootnoteReferenceNumber += nestedFootnotes.length
  }

  return block
}