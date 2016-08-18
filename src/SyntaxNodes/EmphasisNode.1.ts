import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'


// Equivalent to the `<em>` HTML element.
//
// Not to be confused with `ItalicNode`! 
export class EmphasisNode extends RichInlineSyntaxNode {
  protected EMPHASIS_NODE(): void { }
}
