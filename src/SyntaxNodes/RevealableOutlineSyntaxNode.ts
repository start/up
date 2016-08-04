import { RichOutlineSyntaxNode } from './RichOutlineSyntaxNode'


// A "revealable" convention is one that requires deliberate action from the reader to reveal.
export abstract class RevealableOutlineSyntaxNode extends RichOutlineSyntaxNode {
  protected REVEALABLE_OUTLINE_SYNTAX_NODE(): void { }
}
