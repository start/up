import { SectionSeparatorNode } from '../SyntaxNodes/SectionSeparatorNode'
import { OutlineSyntaxNode } from '../SyntaxNodes/OutlineSyntaxNode'
import { InlineSyntaxNode } from '../SyntaxNodes/InlineSyntaxNode'
import { ParagraphNode } from '../SyntaxNodes/ParagraphNode'
import { LineBlockNode } from '../SyntaxNodes/LineBlockNode'
import { HeadingNode } from '../SyntaxNodes/HeadingNode'
import { UnorderedListNode } from '../SyntaxNodes/UnorderedListNode'
import { OrderedListNode } from '../SyntaxNodes/OrderedListNode'
import { MediaSyntaxNode } from '../SyntaxNodes/MediaSyntaxNode'
import { PlaceholderFootnoteReferenceNode, getFootnotesAndMutateToAddReferences } from '../SyntaxNodes/PlaceholderFootnoteReferenceNode'
import { Footnote } from '../SyntaxNodes/Footnote'
import { FootnoteReferenceNode } from '../SyntaxNodes/FootnoteReferenceNode'
import { FootnoteBlockNode } from '../SyntaxNodes/FootnoteBlockNode'
import { TextConsumer } from './TextConsumer'
import { getOutlineNodes } from './Outline/GetOutlineNodes'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'


// TODO: Refactor duplicate functionality

export function parseDocument(text: string): DocumentNode {
  const outlineNodes = getOutlineNodes(text)
  const outlineNodesWithFootnotes: OutlineSyntaxNode[] = []

  let nextFootnoteReferenceOrdinal = 1

  for (const outlineNode of outlineNodes) {
    outlineNodesWithFootnotes.push(outlineNode)

    // This mutates `outlineNode`
    //
    // TODO: Add it to OutlineSyntaxNode directly
    const footnotes = getFootnotesAndAddReferencesToNode(outlineNode, nextFootnoteReferenceOrdinal)

    if (footnotes.length) {
      outlineNodesWithFootnotes.push(new FootnoteBlockNode(footnotes))
      nextFootnoteReferenceOrdinal += footnotes.length
    }
  }

  return new DocumentNode(outlineNodesWithFootnotes)
}

function getFootnotesAndAddReferencesToNodes(outlineNodes: OutlineSyntaxNode[], nextFootnoteReferenceOrdinal: number): Footnote[] {
  const footnotes: Footnote[] = []

  for (const node of outlineNodes) {
    const footnotesForThisNode = getFootnotesAndAddReferencesToNode(node, nextFootnoteReferenceOrdinal)

    footnotes.push(...footnotesForThisNode)
    nextFootnoteReferenceOrdinal += footnotesForThisNode.length
  }

  return footnotes
}

function getFootnotesAndAddReferencesToNode(node: OutlineSyntaxNode, nextFootnoteReferenceOrdinal: number): Footnote[] {
  if ((node instanceof ParagraphNode) || (node instanceof HeadingNode)) {
    return getFootnotesAndMutateToAddReferences(node.children, nextFootnoteReferenceOrdinal)
  }

  if ((node instanceof UnorderedListNode) || (node instanceof OrderedListNode)) {
    return getFootnesAndAddReferencesToAllOutlineContainers(node.listItems, nextFootnoteReferenceOrdinal)
  }
  
  if (node instanceof LineBlockNode) {
    return getFootnesAndAddReferencesToAllInlineContainers(node.lines, nextFootnoteReferenceOrdinal)
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
    const footnotesForThisNode = getFootnotesAndAddReferencesToNodes(container.children, nextFootnoteReferenceOrdinal)

    footnotes.push(...footnotesForThisNode)
    nextFootnoteReferenceOrdinal += footnotesForThisNode.length
  }

  return footnotes
}

function getFootnesAndAddReferencesToAllInlineContainers(items: InlineNodeContainer[], nextFootnoteReferenceOrdinal: number): Footnote[] {
  const footnotes: Footnote[] = []

  for (const container of items) {
    const footnotesForThisNode = getFootnotesAndMutateToAddReferences(container.children, nextFootnoteReferenceOrdinal)

    footnotes.push(...footnotesForThisNode)
    nextFootnoteReferenceOrdinal += footnotesForThisNode.length
  }

  return footnotes
}