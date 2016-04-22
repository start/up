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

    const footnotes = getFootnotesAndAddReferencesToOutlineNode(outlineNode, nextFootnoteReferenceOrdinal)

    if (footnotes.length) {
      outlineNodesWithFootnotes.push(new FootnoteBlockNode(footnotes))
      nextFootnoteReferenceOrdinal += footnotes.length
    }
  }

  return new DocumentNode(outlineNodesWithFootnotes)
}


function getFootnotesAndAddReferencesToOutlineNodes(outlineNodes: OutlineSyntaxNode[], nextFootnoteReferenceOrdinal: number): Footnote[] {
  const footnotes: Footnote[] = []

  for (const node of outlineNodes) {
    const footnotesForThisNode = getFootnotesAndAddReferencesToOutlineNode(node, nextFootnoteReferenceOrdinal)

    footnotes.push(...footnotesForThisNode)
    nextFootnoteReferenceOrdinal += footnotesForThisNode.length
  }

  return footnotes
}


function getFootnotesAndAddReferencesToOutlineNode(node: OutlineSyntaxNode, nextFootnoteReferenceOrdinal: number): Footnote[] {
  if ((node instanceof ParagraphNode) || (node instanceof HeadingNode)) {
    return getFootnotesAndMutateCollectionToAddReferences(node.children, nextFootnoteReferenceOrdinal)
  }

  if ((node instanceof UnorderedListNode) || (node instanceof OrderedListNode)) {
    return getFootnesAndAddReferencesToAllOutlineContainers(node.listItems, nextFootnoteReferenceOrdinal)
  }

  if (node instanceof LineBlockNode) {
    return getFootnesAndAddReferencesToAllInlineContainers(node.lines, nextFootnoteReferenceOrdinal)
  }

  if (node instanceof DescriptionListNode) {
    return getFootnesAndAddReferencesToAllDescriptionListItems(node.listItems, nextFootnoteReferenceOrdinal)
  }
  
  if (node instanceof BlockquoteNode) {
    applyBlocknoteReferencesAndGetCount(node, nextFootnoteReferenceOrdinal)
    return []
  }

  return []
}


interface OutlineNodeContainer {
  children: OutlineSyntaxNode[]
}


interface InlineNodeContainer {
  children: InlineSyntaxNode[]
}


function getFootnesAndAddReferencesToAllOutlineContainers(containers: OutlineNodeContainer[], nextFootnoteReferenceOrdinal: number): Footnote[] {
  const footnotes: Footnote[] = []

  for (const container of containers) {
    const footnotesForThisNode = getFootnotesAndAddReferencesToOutlineNodes(container.children, nextFootnoteReferenceOrdinal)

    footnotes.push(...footnotesForThisNode)
    nextFootnoteReferenceOrdinal += footnotesForThisNode.length
  }

  return footnotes
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


function getFootnesAndAddReferencesToAllDescriptionListItems(listItems: DescriptionListItem[], nextFootnoteReferenceOrdinal: number): Footnote[] {
  const footnotes: Footnote[] = []

  for (const listItem of listItems) {
    const footnotesForTerms = getFootnesAndAddReferencesToAllInlineContainers(listItem.terms, nextFootnoteReferenceOrdinal)

    footnotes.push(...footnotesForTerms)
    nextFootnoteReferenceOrdinal += footnotesForTerms.length

    const footnotesForDescription = getFootnotesAndAddReferencesToOutlineNodes(listItem.description.children, nextFootnoteReferenceOrdinal)

    footnotes.push(...footnotesForDescription)
    nextFootnoteReferenceOrdinal += footnotesForDescription.length
  }

  return footnotes
}

function applyBlocknoteReferencesAndGetCount(blockquote: BlockquoteNode, nextFootnoteReferenceOrdinal: number): number {
  const childrenWithFootnotes: OutlineSyntaxNode[] = []

  for (const outlineNode of blockquote.children) {
    childrenWithFootnotes.push(outlineNode)

    const footnotes = getFootnotesAndAddReferencesToOutlineNode(outlineNode, nextFootnoteReferenceOrdinal)

    if (footnotes.length) {
      childrenWithFootnotes.push(new FootnoteBlockNode(footnotes))
      nextFootnoteReferenceOrdinal += footnotes.length
    }
  }

  blockquote.children = childrenWithFootnotes

  return childrenWithFootnotes.length
}