import { RichOutlineSyntaxNode } from './RichOutlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { UpDocument } from './UpDocument'


// A "revealable" convention is one that requires deliberate action from the reader to reveal.
export abstract class RevealableOutlineSyntaxNode extends RichOutlineSyntaxNode {
  public sourceLineNumber: number = undefined

  constructor(
    children: OutlineSyntaxNode[],
    options: { sourceLineNumber?: number } = {}
  ) {
    super(children)

    this.sourceLineNumber = options.sourceLineNumber
  }
  // As a rule, we don't want to include any revealable (i.e. initially hidden) headings in the
  // table of contents.
  descendantsToIncludeInTableOfContents(): UpDocument.TableOfContents.Entry[] {
    return []
  }

  protected REVEALABLE_OUTLINE_SYNTAX_NODE(): void { }
}
