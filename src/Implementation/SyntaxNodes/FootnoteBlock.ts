import { Renderer } from '../Rendering/Renderer'
import { Document } from './Document'
import { Footnote } from './Footnote'
import { getInlineDescendants } from './getInlineDescendants'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class FootnoteBlock implements OutlineSyntaxNode {
  constructor(public footnotes: Footnote[]) { }

  get sourceLineNumber(): number | undefined {
    // The source line number of a footnote block wouldn't be particulalry meaninful.
    return undefined
  }

  descendantsToIncludeInTableOfContents(): Document.TableOfContents.Entry[] {
    return []
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return getInlineDescendants(this.footnotes)
  }

  render(renderer: Renderer): string {
    return renderer.footnoteBlock(this)
  }
}
