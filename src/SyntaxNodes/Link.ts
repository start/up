import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { Document } from './Document'
import { Renderer } from '../Rendering/Renderer'


// If a line consists solely of media conventions *or media conventions within links*,
// those media conventions are placed directly into the outline.
export class Link extends RichInlineSyntaxNode implements OutlineSyntaxNode {
  public sourceLineNumber: number | undefined = undefined

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
