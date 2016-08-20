import { Footnote } from './Footnote'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { UpDocument } from './UpDocument'


export class FootnoteBlock implements OutlineSyntaxNode {
  get sourceLineNumber(): number {
    // The source line number of a footnote block wouldn't be particulalry meaninful.
    return undefined
  }

  constructor(public footnotes: Footnote[]) { }

  descendantsToIncludeInTableOfContents(): UpDocument.TableOfContents.Entry[] {
    return []
  }

  protected FOOTNOTE_BLOCK(): void { }
}
