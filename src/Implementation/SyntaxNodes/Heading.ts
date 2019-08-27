import { Renderer } from '../Rendering/Renderer'
import { Document } from './Document'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class Heading extends InlineSyntaxNodeContainer implements OutlineSyntaxNode, Document.TableOfContents.Entry {
  level: number
  titleMarkup: string
  ordinalInTableOfContents: number | undefined = undefined
  sourceLineNumber: number | undefined = undefined

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

  descendantsToIncludeInTableOfContents(): Document.TableOfContents.Entry[] {
    return []
  }

  render(renderer: Renderer): string {
    return renderer.heading(this)
  }
}
