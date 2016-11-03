import { Document } from './Document'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { Renderer } from '../Rendering/Renderer'


export class Heading extends InlineSyntaxNodeContainer implements OutlineSyntaxNode, Document.TableOfContents.Entry {
  level: number
  searchableMarkup: string
  ordinalInTableOfContents: number = undefined
  sourceLineNumber: number = undefined

  constructor(
    children: InlineSyntaxNode[],
    options: {
      level: number
      searchableMarkup: string
      ordinalInTableOfContents?: number
      sourceLineNumber?: number
    }
  ) {
    super(children)

    this.level = options.level
    this.searchableMarkup = options.searchableMarkup
    this.ordinalInTableOfContents = options.ordinalInTableOfContents
    this.sourceLineNumber = options.sourceLineNumber
  }

  descendantsToIncludeInTableOfContents(): Document.TableOfContents.Entry[] {
    return []
  }

  contentWithinTableOfContents(): InlineSyntaxNode[] {
    return this.children
  }

  render(renderer: Renderer): string {
    return renderer.heading(this)
  }
}
