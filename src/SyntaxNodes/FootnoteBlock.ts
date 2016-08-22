import { Footnote } from './Footnote'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { UpDocument } from './UpDocument'
import { getInlineDescendants } from './getInlineDescendants'
import { Writer } from '../Writing/Writer'


export class FootnoteBlock implements OutlineSyntaxNode {
  constructor(public footnotes: Footnote[]) { }

  get sourceLineNumber(): number {
    // The source line number of a footnote block wouldn't be particulalry meaninful.
    return undefined
  }

  descendantsToIncludeInTableOfContents(): UpDocument.TableOfContents.Entry[] {
    return []
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return getInlineDescendants(this.footnotes)
  }

  write(writer: Writer): string {
    return writer.footnoteBlock(this)
  }
  
  protected FOOTNOTE_BLOCK(): void { }
}
