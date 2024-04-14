import { Renderer } from '../Rendering/Renderer'
import { Heading } from './Heading'
import { Footnote } from './Footnote'
import { getInlineDescendants } from './getInlineDescendants'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class FootnoteBlock implements OutlineSyntaxNode {
  constructor(public footnotes: Footnote[]) { }

  // The source line number of a footnote block wouldn't be particularly meaningful.
  readonly sourceLineNumber = undefined

  descendantsToIncludeInTableOfContents(): Heading[] {
    return []
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return getInlineDescendants(this.footnotes)
  }

  render(renderer: Renderer): string {
    return renderer.footnoteBlock(this)
  }
}
