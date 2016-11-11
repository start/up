import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { Document } from './Document'
import { Renderer } from '../Rendering/Renderer'


export class Paragraph extends InlineSyntaxNodeContainer implements OutlineSyntaxNode {
  public sourceLineNumber: number | undefined = undefined

  constructor(children: InlineSyntaxNode[], options?: { sourceLineNumber: number }) {
    super(children)

    if (options) {
      this.sourceLineNumber = options.sourceLineNumber
    }
  }

  descendantsToIncludeInTableOfContents(): Document.TableOfContents.Entry[] {
    return []
  }

  render(renderer: Renderer): string {
    return renderer.paragraph(this)
  }

  protected PARAGRAPH(): void { }
}
