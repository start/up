import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'


// Equivalent to the `<b>` HTML element.
//
// Not to be confused with `Stress`! 
export class Bold extends RichInlineSyntaxNode {
  protected BOLD(): void { }
}
