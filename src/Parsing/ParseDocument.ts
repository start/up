import { SectionSeparatorNode } from '../SyntaxNodes/SectionSeparatorNode'
import { OutlineSyntaxNode } from '../SyntaxNodes/OutlineSyntaxNode'
import { InlineSyntaxNode } from '../SyntaxNodes/InlineSyntaxNode'
import { ParagraphNode } from '../SyntaxNodes/ParagraphNode'
import { UnorderedListNode } from '../SyntaxNodes/UnorderedListNode'
import { MediaSyntaxNode } from '../SyntaxNodes/MediaSyntaxNode'
import { PlaceholderFootnoteReferenceNode, getFootnotesAndMutateToAddReferences } from '../SyntaxNodes/PlaceholderFootnoteReferenceNode'
import { Footnote } from '../SyntaxNodes/Footnote'
import { FootnoteReferenceNode } from '../SyntaxNodes/FootnoteReferenceNode'
import { FootnoteBlockNode } from '../SyntaxNodes/FootnoteBlockNode'
import { TextConsumer } from './TextConsumer'
import { getOutlineNodes } from './Outline/GetOutlineNodes'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'

// TODO: Fix names

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
    footnotes.push(...getFootnotesAndAddReferencesToNode(node, nextFootnoteReferenceOrdinal))
  }

  return footnotes
}

function getFootnotesAndAddReferencesToNode(node: OutlineSyntaxNode, nextFootnoteReferenceOrdinal: number): Footnote[] {
  if (node instanceof ParagraphNode) {
    return getFootnotesAndMutateToAddReferences(node.children, nextFootnoteReferenceOrdinal)
  }

  if (node instanceof UnorderedListNode) {
    const footnotes: Footnote[] = []

    for (const listItem of node.listItems) {
      footnotes.push(...getFootnotesAndAddReferencesToNodes(listItem.children, nextFootnoteReferenceOrdinal))
    }

    return footnotes
  }

  return []
}
