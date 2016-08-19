import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'


// Equivalent to the `<strong>` HTML element.
//
// Not to be confused with `BoldNode`! 
export class Stress extends RichInlineSyntaxNode {
  protected STRESS_NODE(): void { }
}
