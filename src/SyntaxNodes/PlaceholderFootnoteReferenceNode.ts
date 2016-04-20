import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'

// `PlaceholderFootnoteReferenceNodes` do not appear the final AST.
//
// Instead, each `PlaceholderFootnoteReferenceNode` is eventually swapped out for a `FoonoteReferenceNode`.
// The node's original contents are placed inside of a corresponding `FootnoteNode`.
export class PlaceholderFootnoteReferenceNode extends RichInlineSyntaxNode {
  private PLACEHOLDER_FOOTNOTE_REFERENCE: any = null
}
