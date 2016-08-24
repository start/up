import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { UpDocument } from './UpDocument'
import { Renderer } from '../Rendering/Renderer'


// If a line consists solely of media conventions (and/or whitespace), those media conventions are
// placed directly into the outline rather into a paragraph.
//
// If a media convention is "linkified", or if a link otherwise contains only media conventions (and
// whitespace), the link counts as media. In that situation, the link itself is placed directly into
// the outline.
export class Link extends RichInlineSyntaxNode implements OutlineSyntaxNode {
  public sourceLineNumber: number = undefined

  constructor(
    children: InlineSyntaxNode[],
    public url: string,
    options?: {
      sourceLineNumber: number
    }) {
    super(children)

    if (options) {
      this.sourceLineNumber = options.sourceLineNumber
    }
  }

  shouldBeIncludedInTableOfContents(): boolean {
    return false
  }

  descendantsToIncludeInTableOfContents(): UpDocument.TableOfContents.Entry[] {
    return []
  }

  write(writer: Renderer): string {
    return writer.link(this)
  }
}
