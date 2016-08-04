import { RichOutlineSyntaxNode } from './RichOutlineSyntaxNode'


// A "revealable" convention is one that requires deliberate action from the reader to reveal.
export abstract class RevealableOutlineSyntaxNode extends RichOutlineSyntaxNode {
  shouldBeIncludedInTableOfContents(): boolean {
    return false
  }

  protected REVEALABLE_OUTLINE_SYNTAX_NODE(): void { }
}
