import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'


// A "revealable" convention is one that requires deliberate action from the reader to reveal.
export abstract class RevealableInlineSyntaxNode extends RichInlineSyntaxNode {
  protected REVEALABLE_INLINE_SYNTAX_NODE(): void { }
}
