import { FootnoteNode } from './FootnoteNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class FootnoteBlockNode implements OutlineSyntaxNode {
  get sourceLineNumber(): number {
    // The source line number of a footnote block wouldn't be particulalry meaninful.
    return undefined
  }

  constructor(public footnotes: FootnoteNode[]) { }

  shouldBeIncludedInTableOfContents(): boolean {
    return false
  }

  descendantsToIncludeInTableOfContents(): OutlineSyntaxNode[] {
    return []
  }

  protected FOOTNOTE_BLOCK(): void { }
}
