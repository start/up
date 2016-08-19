import { Footnote } from './Footnote'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class FootnoteBlock implements OutlineSyntaxNode {
  get sourceLineNumber(): number {
    // The source line number of a footnote block wouldn't be particulalry meaninful.
    return undefined
  }

  constructor(public footnotes: Footnote[]) { }

  shouldBeIncludedInTableOfContents(): boolean {
    return false
  }

  descendantsToIncludeInTableOfContents(): OutlineSyntaxNode[] {
    return []
  }

  protected FOOTNOTE_BLOCK(): void { }
}
