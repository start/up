import { Renderer } from '../Rendering/Renderer'
import { Document } from './Document'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class Paragraph extends InlineSyntaxNodeContainer implements OutlineSyntaxNode {
  sourceLineNumber: number | undefined = undefined

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
