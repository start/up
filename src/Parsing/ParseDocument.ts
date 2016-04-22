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
import { PlaceholderFootnoteReferenceNode, replacePotentialReferencesAndGetFootnotes } from '../SyntaxNodes/PlaceholderFootnoteReferenceNode'
import { Footnote } from '../SyntaxNodes/Footnote'
import { FootnoteReferenceNode } from '../SyntaxNodes/FootnoteReferenceNode'
import { FootnoteBlockNode } from '../SyntaxNodes/FootnoteBlockNode'
import { TextConsumer } from './TextConsumer'
import { getOutlineNodes } from './Outline/GetOutlineNodes'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'


// =~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~
// TODO: Refactor tons of duplicate functionality
// =~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~=~


export function parseDocument(text: string): DocumentNode {
  const outlineNodes = getOutlineNodes(text)
  const outlineNodesWithFootnotes: OutlineSyntaxNode[] = []

  let nextFootnoteReferenceOrdinal = 1

  for (const outlineNode of outlineNodes) {
    outlineNodesWithFootnotes.push(outlineNode)

    const result = processFootnotes(outlineNode, nextFootnoteReferenceOrdinal)

    if (result.footnotesToPlaceInNextBlock.length) {
      outlineNodesWithFootnotes.push(new FootnoteBlockNode(result.footnotesToPlaceInNextBlock))
    }

    nextFootnoteReferenceOrdinal += result.counAlltFootnotes()
  }

  return new DocumentNode(outlineNodesWithFootnotes)
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


function processFootnotesForOutlineNodes(outlineNodes: OutlineSyntaxNode[], nextFootnoteReferenceOrdinal: number): ProcessOutlineContainerFootnotesResult {
  const result = new ProcessOutlineContainerFootnotesResult()

  for (const outlineNode of outlineNodes) {
    const outlineNodeResult = processFootnotes(outlineNode, nextFootnoteReferenceOrdinal)

    nextFootnoteReferenceOrdinal += outlineNodeResult.counAlltFootnotes()
    result.include(outlineNodeResult)
  }

  return result
}


function processFootnotes(node: OutlineSyntaxNode, nextFootnoteReferenceOrdinal: number): ProcessOutlineContainerFootnotesResult {
  if ((node instanceof ParagraphNode) || (node instanceof HeadingNode)) {
    return new ProcessOutlineContainerFootnotesResult({
      footnotesToPlaceInNextBlock: replacePotentialReferencesAndGetFootnotes(node.children, nextFootnoteReferenceOrdinal)
    })
  }

  if ((node instanceof UnorderedListNode) || (node instanceof OrderedListNode)) {
    return processOutlineContainersFootnotes(node.listItems, nextFootnoteReferenceOrdinal)
  }

  if (node instanceof LineBlockNode) {
    return new ProcessOutlineContainerFootnotesResult({
      footnotesToPlaceInNextBlock: replaceInlineContainersPotentialReferencesAndGetFootnotes(node.lines, nextFootnoteReferenceOrdinal)
    })
  }

  if (node instanceof DescriptionListNode) {
    return processDescriptionListItemFootnotes(node.listItems, nextFootnoteReferenceOrdinal)
  }

  if (node instanceof BlockquoteNode) {
    return new ProcessOutlineContainerFootnotesResult({
      countFootnotesInBlockquotes: processBlockquoteFootnotesAndgetCount(node, nextFootnoteReferenceOrdinal)
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


function processOutlineContainersFootnotes(containers: OutlineNodeContainer[], nextFootnoteReferenceOrdinal: number): ProcessOutlineContainerFootnotesResult {
  const result = new ProcessOutlineContainerFootnotesResult()

  for (const container of containers) {
    const resultForThisOutlineContainer = processFootnotesForOutlineNodes(container.children, nextFootnoteReferenceOrdinal)

    nextFootnoteReferenceOrdinal += resultForThisOutlineContainer.counAlltFootnotes()
    result.include(resultForThisOutlineContainer)
  }

  return result
}


function processDescriptionListItemFootnotes(listItems: DescriptionListItem[], nextFootnoteReferenceOrdinal: number): ProcessOutlineContainerFootnotesResult {
  const result = new ProcessOutlineContainerFootnotesResult()

  for (const listItem of listItems) {
    const footnotesForTerms = replaceInlineContainersPotentialReferencesAndGetFootnotes(listItem.terms, nextFootnoteReferenceOrdinal)

    result.includeFootnotesToPlaceInNextBlock(footnotesForTerms)
    nextFootnoteReferenceOrdinal += footnotesForTerms.length

    const descriptionResult = processFootnotesForOutlineNodes(listItem.description.children, nextFootnoteReferenceOrdinal)

    nextFootnoteReferenceOrdinal += descriptionResult.counAlltFootnotes()
    result.include(descriptionResult)
  }

  return result
}


function processBlockquoteFootnotesAndgetCount(blockquote: BlockquoteNode, nextFootnoteReferenceOrdinal: number): number {
  const originalFootnoteReferenceOrdinal = nextFootnoteReferenceOrdinal
  const outlineNodesWithFootnotes: OutlineSyntaxNode[] = []

  for (const outlineNode of blockquote.children) {
    outlineNodesWithFootnotes.push(outlineNode)

    const outlineNodeResult = processFootnotes(outlineNode, nextFootnoteReferenceOrdinal)

    if (outlineNodeResult.footnotesToPlaceInNextBlock.length) {
      outlineNodesWithFootnotes.push(
        new FootnoteBlockNode(outlineNodeResult.footnotesToPlaceInNextBlock))
    }

    nextFootnoteReferenceOrdinal += outlineNodeResult.counAlltFootnotes()
  }

  blockquote.children = outlineNodesWithFootnotes
  
  return nextFootnoteReferenceOrdinal - originalFootnoteReferenceOrdinal
}


function replaceInlineContainersPotentialReferencesAndGetFootnotes(inlineContainers: InlineNodeContainer[], nextFootnoteReferenceOrdinal: number): Footnote[] {
  const footnotes: Footnote[] = []

  for (const container of inlineContainers) {
    const containerFootnotes = replacePotentialReferencesAndGetFootnotes(container.children, nextFootnoteReferenceOrdinal)

    footnotes.push(...containerFootnotes)
    nextFootnoteReferenceOrdinal += containerFootnotes.length
  }

  return footnotes
}