import { SectionSeparatorNode } from '../SyntaxNodes/SectionSeparatorNode'
import { OutlineSyntaxNode } from '../SyntaxNodes/OutlineSyntaxNode'
import { InlineSyntaxNode } from '../SyntaxNodes/InlineSyntaxNode'
import { ParagraphNode } from '../SyntaxNodes/ParagraphNode'
import { MediaSyntaxNode } from '../SyntaxNodes/MediaSyntaxNode'
import { InlineAsideNode } from '../SyntaxNodes/InlineAsideNode'
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
  
  for (const outlineNode of outlineNodes) {
    outlineNodesWithFootnotes.push(outlineNode)
    
    // This mutates `outlineNode`
    //
    // TODO: Add it to OutlineSyntaxNode directly
    const footnotes = addReferencesToOutlineNodeAndGetFootnotes(outlineNode)
    
    if (footnotes.length) {
      outlineNodesWithFootnotes.push(new FootnoteBlockNode(footnotes))
    }
  }
  
  return new DocumentNode(outlineNodesWithFootnotes)
}

function addReferencesToOutlineNodeAndGetFootnotes(outlineNode: OutlineSyntaxNode, nextFootnoteOrdinal = 1): Footnote[] {
  if (outlineNode instanceof ParagraphNode) {
   return addReferencesAndGetFootnotes(outlineNode.children, nextFootnoteOrdinal)
  }
  
  return []
}

// This function mutates the `nodes` array, replacing any `InlineAsideNodes` with `FootnoteReferenceNodes`.
//
// The contents of all the (replaced) `InlineAsideNodes` are then returned.
function addReferencesAndGetFootnotes(nodes: InlineSyntaxNode[], nextFootnoteOrdinal: number): Footnote[] {
  const footnotes: Footnote[] = []
  
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    
    if (node instanceof InlineAsideNode) {
      footnotes.push(new Footnote(node.children, nextFootnoteOrdinal))
      nodes[i] = new FootnoteReferenceNode(nextFootnoteOrdinal)
      nextFootnoteOrdinal += 1
    }
  }
  
  return footnotes
}