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
import { PlaceholderFootnoteReferenceNode, getFootnotesAndMutateCollectionToAddReferences } from '../SyntaxNodes/PlaceholderFootnoteReferenceNode'
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

    const result = getFootnotesAndAddReferencesToOutlineNode(outlineNode, nextFootnoteReferenceOrdinal)

    if (result.footnotesToPlaceInNextBlock.length) {
      outlineNodesWithFootnotes.push(new FootnoteBlockNode(result.footnotesToPlaceInNextBlock))
    }

    nextFootnoteReferenceOrdinal += result.counAlltFootnotes()
  }

  return new DocumentNode(outlineNodesWithFootnotes)
}


interface ApplyFootnotesToOutlineContainerResultArgs {
  footnotesToPlaceInNextBlock?: Footnote[]
  countFootnotesInBlockquotes?: number
}


class ApplyFootnotesToOutlineContainerResult {
  public footnotesToPlaceInNextBlock: Footnote[]
  private countFootnotesInBlockquotes: number

  constructor(args?: ApplyFootnotesToOutlineContainerResultArgs) {
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

  includefootnotesToPlaceInNextBlock(footnotes: Footnote[]): void {
    this.footnotesToPlaceInNextBlock = this.footnotesToPlaceInNextBlock.concat(footnotes)
  }

  include(other: ApplyFootnotesToOutlineContainerResult): void {
    this.includefootnotesToPlaceInNextBlock(other.footnotesToPlaceInNextBlock)
    this.includeCountFootnotesInBlockquotes(other.countFootnotesInBlockquotes)
  }
}


function applyFootnotesToOutlineNodes(outlineNodes: OutlineSyntaxNode[], nextFootnoteReferenceOrdinal: number): ApplyFootnotesToOutlineContainerResult {
  const result = new ApplyFootnotesToOutlineContainerResult()

  for (const node of outlineNodes) {
    const resultForThisNode = getFootnotesAndAddReferencesToOutlineNode(node, nextFootnoteReferenceOrdinal)

    nextFootnoteReferenceOrdinal += resultForThisNode.counAlltFootnotes()
    result.include(resultForThisNode)
  }

  return result
}


function getFootnotesAndAddReferencesToOutlineNode(node: OutlineSyntaxNode, nextFootnoteReferenceOrdinal: number): ApplyFootnotesToOutlineContainerResult {
  if ((node instanceof ParagraphNode) || (node instanceof HeadingNode)) {
    return new ApplyFootnotesToOutlineContainerResult({
      footnotesToPlaceInNextBlock: getFootnotesAndMutateCollectionToAddReferences(node.children, nextFootnoteReferenceOrdinal)
    })
  }

  if ((node instanceof UnorderedListNode) || (node instanceof OrderedListNode)) {
    return getFootnesAndAddReferencesToAllOutlineContainers(node.listItems, nextFootnoteReferenceOrdinal)
  }

  if (node instanceof LineBlockNode) {
    return new ApplyFootnotesToOutlineContainerResult({
      footnotesToPlaceInNextBlock: getFootnesAndAddReferencesToAllInlineContainers(node.lines, nextFootnoteReferenceOrdinal)
    })
  }

  if (node instanceof DescriptionListNode) {
    return getFootnesAndAddReferencesToAllDescriptionListItems(node.listItems, nextFootnoteReferenceOrdinal)
  }

  if (node instanceof BlockquoteNode) {
    return new ApplyFootnotesToOutlineContainerResult({
      countFootnotesInBlockquotes: applyBlocknoteReferencesAndGetCount(node, nextFootnoteReferenceOrdinal)
    })
  }

  return new ApplyFootnotesToOutlineContainerResult()
}


interface OutlineNodeContainer {
  children: OutlineSyntaxNode[]
}


interface InlineNodeContainer {
  children: InlineSyntaxNode[]
}


function getFootnesAndAddReferencesToAllOutlineContainers(containers: OutlineNodeContainer[], nextFootnoteReferenceOrdinal: number): ApplyFootnotesToOutlineContainerResult {
  const result = new ApplyFootnotesToOutlineContainerResult()

  for (const container of containers) {
    const resultForThisOutlineContainer = applyFootnotesToOutlineNodes(container.children, nextFootnoteReferenceOrdinal)

    nextFootnoteReferenceOrdinal += resultForThisOutlineContainer.counAlltFootnotes()
    result.include(resultForThisOutlineContainer)
  }

  return result
}


function getFootnesAndAddReferencesToAllInlineContainers(items: InlineNodeContainer[], nextFootnoteReferenceOrdinal: number): Footnote[] {
  const footnotes: Footnote[] = []

  for (const container of items) {
    const footnotesForThisNode = getFootnotesAndMutateCollectionToAddReferences(container.children, nextFootnoteReferenceOrdinal)

    footnotes.push(...footnotesForThisNode)
    nextFootnoteReferenceOrdinal += footnotesForThisNode.length
  }

  return footnotes
}


function getFootnesAndAddReferencesToAllDescriptionListItems(listItems: DescriptionListItem[], nextFootnoteReferenceOrdinal: number): ApplyFootnotesToOutlineContainerResult {
  const result = new ApplyFootnotesToOutlineContainerResult()

  for (const listItem of listItems) {
    const footnotesForTerms = getFootnesAndAddReferencesToAllInlineContainers(listItem.terms, nextFootnoteReferenceOrdinal)

    result.includefootnotesToPlaceInNextBlock(footnotesForTerms)
    nextFootnoteReferenceOrdinal += footnotesForTerms.length

    const descriptionResult = applyFootnotesToOutlineNodes(listItem.description.children, nextFootnoteReferenceOrdinal)

    nextFootnoteReferenceOrdinal += descriptionResult.counAlltFootnotes()
    result.include(descriptionResult)
  }

  return result
}

function applyBlocknoteReferencesAndGetCount(blockquote: BlockquoteNode, nextFootnoteReferenceOrdinal: number): number {
  const childrenWithFootnotes: OutlineSyntaxNode[] = []

  for (const outlineNode of blockquote.children) {
    childrenWithFootnotes.push(outlineNode)

    const result = getFootnotesAndAddReferencesToOutlineNode(outlineNode, nextFootnoteReferenceOrdinal)

    if (result.footnotesToPlaceInNextBlock.length) {
      childrenWithFootnotes.push(new FootnoteBlockNode(result.footnotesToPlaceInNextBlock))
    }

    nextFootnoteReferenceOrdinal += result.counAlltFootnotes()
  }

  blockquote.children = childrenWithFootnotes

  return childrenWithFootnotes.length
}