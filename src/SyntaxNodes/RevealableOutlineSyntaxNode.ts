import { RichOutlineSyntaxNode } from './RichOutlineSyntaxNode'
import { Heading } from './Heading'


// A "revealable" convention is one that requires deliberate action from the reader to reveal.
export abstract class RevealableOutlineSyntaxNode extends RichOutlineSyntaxNode {
  // As a rule, we don't want to include any revealable (i.e. initially hidden) headings in the
  // table of contents.
  descendantHeadingsToIncludeInTableOfContents(): Heading[] {
    return []
  }

  protected REVEALABLE_OUTLINE_SYNTAX_NODE(): void { }
}
