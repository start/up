import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { FootnoteReferenceNode } from './FootnoteReferenceNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { Footnote } from './Footnote'

// `PlaceholderFootnoteReferenceNodes` do not appear the final AST.
//
// Instead, each `PlaceholderFootnoteReferenceNode` is eventually swapped out for a `FoonoteReferenceNode`.
// The node's original contents are placed inside of a corresponding `FootnoteNode`.
export class PlaceholderFootnoteReferenceNode extends RichInlineSyntaxNode {
  private PLACEHOLDER_FOOTNOTE_REFERENCE: any = null
}

// This function mutates the `inlineNodes` array, replacing any of its `PlaceholderFootnoteReferenceNodes`
// with `FootnoteReferenceNodes`.
//
// It returns a collection of `Footnotes`, each of which contain the contents of the corresponding
// (replaced) `PlaceholderFootnoteReferenceNode`.
export function addReferencesAndGetFootnotes(inlineNodes: InlineSyntaxNode[], nextFootnoteOrdinal: number): Footnote[] {
  const footnotes: Footnote[] = []
  
  for (let i = 0; i < inlineNodes.length; i++) {
    const node = inlineNodes[i]
    
    if (node instanceof PlaceholderFootnoteReferenceNode) {
      footnotes.push(new Footnote(node.children, nextFootnoteOrdinal))
      inlineNodes[i] = new FootnoteReferenceNode(nextFootnoteOrdinal)
      nextFootnoteOrdinal += 1
    }
  }
  
  return footnotes
}
