import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'


// Equivalent to the `<b>` HTML element.
//
// Not to be confused with `StressNode`! 
export class BoldNode extends RichInlineSyntaxNode {
  protected BOLD_NODE(): void { }
}
