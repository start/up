import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'


// Equivalent to the `<strong>` HTML element.
//
// Not to be confused with `Bold`! 
export class Stress extends RichInlineSyntaxNode {
  protected STRESS(): void { }
}
