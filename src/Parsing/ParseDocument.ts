import { SectionSeparatorNode } from '../SyntaxNodes/SectionSeparatorNode'
import { OutlineSyntaxNode } from '../SyntaxNodes/OutlineSyntaxNode'
import { InlineSyntaxNode } from '../SyntaxNodes/InlineSyntaxNode'
import { ParagraphNode } from '../SyntaxNodes/ParagraphNode'
import { MediaSyntaxNode } from '../SyntaxNodes/MediaSyntaxNode'
import { InlineAsideNode } from '../SyntaxNodes/InlineAsideNode'
import { FootnoteReferenceNode } from '../SyntaxNodes/FootnoteReferenceNode'
import { TextConsumer } from './TextConsumer'
import { getOutlineNodes } from './Outline/GetOutlineNodes'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'

// TODO: Fix names

export function parseDocument(text: string): DocumentNode {
  const outlineNodes = getOutlineNodes(text)
  
  for (const outlineNode of outlineNodes) {
    const inlineNodesPerFootnote =
      referenceFootnotesAndGetReferencedContents(outlineNode)
  }
  
  return new DocumentNode(outlineNodes)
}

function referenceFootnotesAndGetReferencedContents(outlineNode: OutlineSyntaxNode, nextFootnoteOrdinal = 1): InlineSyntaxNode[][] {
  if (outlineNode instanceof ParagraphNode) {
   return addFootnoteReferencesAndGetReferencedContents(outlineNode.children, nextFootnoteOrdinal)
  }
}

// This function mutates the `nodes` array, replacing any `InlineAsideNodes` with `FootnoteReferenceNodes`.
//
// The contents of all the (replaced) `InlineAsideNodes` are then returned.
function addFootnoteReferencesAndGetReferencedContents(nodes: InlineSyntaxNode[], nextFootnoteOrdinal = 1): InlineSyntaxNode[][] {
  const inlienNodesPerFootnote: InlineSyntaxNode[][] = []
  
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    
    if (node instanceof InlineAsideNode) {
      inlienNodesPerFootnote.push(node.children)
      nodes[i] = new FootnoteReferenceNode(nextFootnoteOrdinal)
      nextFootnoteOrdinal += 1
    }
  }
  
  return inlienNodesPerFootnote
}