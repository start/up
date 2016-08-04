import { RichOutlineSyntaxNode } from './RichOutlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'


// A "revealable" convention is one that requires deliberate action from the reader to reveal.
export abstract class RevealableOutlineSyntaxNode extends RichOutlineSyntaxNode {
  shouldBeIncludedInTableOfContents(): boolean {
    return false
  }
  
  // As a rule, we don't want to include any revealable content in the table of contents.
  childrenToIncludeInTableOfContents(): OutlineSyntaxNode[] {
    return []
  }

  protected REVEALABLE_OUTLINE_SYNTAX_NODE(): void { }
}
