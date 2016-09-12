import { RichOutlineSyntaxNode } from './RichOutlineSyntaxNode'
import { Document } from './Document'


// A "revealable" convention is one that requires deliberate action from the reader to reveal.
export abstract class RevealableOutlineSyntaxNode extends RichOutlineSyntaxNode {
  // As a rule, we don't want to include any revealable (i.e. initially hidden) headings in the
  // table of contents.
  descendantsToIncludeInTableOfContents(): Document.TableOfContents.Entry[] {
    return []
  }

  protected REVEALABLE_OUTLINE_SYNTAX_NODE(): void { }
}
