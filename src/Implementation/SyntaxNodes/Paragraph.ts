import { Renderer } from '../Rendering/Renderer'
import { Heading } from './Heading'
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

  descendantsToIncludeInTableOfContents(): Heading[] {
    return []
  }

  render(renderer: Renderer): string {
    return renderer.paragraph(this)
  }

  protected PARAGRAPH(): void { }
}
