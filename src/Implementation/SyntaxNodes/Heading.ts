import { Renderer } from '../Rendering/Renderer'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class Heading extends InlineSyntaxNodeContainer implements OutlineSyntaxNode {
  level: number
  titleMarkup: string
  ordinalInTableOfContents?: number
  sourceLineNumber?: number

  constructor(
    children: InlineSyntaxNode[],
    options: {
      level: number
      titleMarkup: string
      ordinalInTableOfContents?: number
      sourceLineNumber?: number
    }
  ) {
    super(children)

    this.level = options.level
    this.titleMarkup = options.titleMarkup
    this.ordinalInTableOfContents = options.ordinalInTableOfContents
    this.sourceLineNumber = options.sourceLineNumber
  }

  descendantsToIncludeInTableOfContents(): Heading[] {
    return []
  }

  render(renderer: Renderer): string {
    return renderer.heading(this)
  }
}
