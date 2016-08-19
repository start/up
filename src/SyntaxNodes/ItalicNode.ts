import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'


// Equivalent to the `<i>` HTML element.
//
// Not to be confused with `Emphasis`! 
export class ItalicNode extends RichInlineSyntaxNode {
  protected ITALIC(): void { }
}
