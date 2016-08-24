import { Footnote } from './Footnote'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { UpDocument } from './UpDocument'
import { getInlineDescendants } from './getInlineDescendants'
import { Renderer } from '../Rendering/Renderer'


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

  render(renderer: Renderer): string {
    return renderer.footnoteBlock(this)
  }
  
  protected FOOTNOTE_BLOCK(): void { }
}
