import { Renderer } from '../Rendering/Renderer'
import { Document } from './Document'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'


// If a line consists solely of media conventions *or media conventions within links*,
// those media conventions are placed directly into the outline.
export class Link extends RichInlineSyntaxNode implements OutlineSyntaxNode {
  sourceLineNumber: number | undefined = undefined

  constructor(
    children: InlineSyntaxNode[],
    public url: string,
    options?: { sourceLineNumber: number }
  ) {
    super(children)

    if (options) {
      this.sourceLineNumber = options.sourceLineNumber
    }
  }

  descendantsToIncludeInTableOfContents(): Document.TableOfContents.Entry[] {
    return []
  }

  render(renderer: Renderer): string {
    return renderer.link(this)
  }
}
