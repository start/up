import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'


// Equivalent to the `<em>` HTML element.
//
// Not to be confused with `ItalicNode`! 
export class Emphasis extends RichInlineSyntaxNode {
  protected EMPHASIS(): void { }
}
