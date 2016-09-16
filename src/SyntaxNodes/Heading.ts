import { Document } from './Document'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { InlineSyntaxNodeContainer } from './InlineSyntaxNodeContainer'
import { getSearchableText } from './getSearchableText'
import { Renderer } from '../Rendering/Renderer'


export class Heading extends InlineSyntaxNodeContainer implements OutlineSyntaxNode, Document.TableOfContents.Entry {
  public level: number
  public ordinalInTableOfContents: number = undefined
  public sourceLineNumber: number = undefined

  constructor(
    children: InlineSyntaxNode[],
    options: {
      level: number
      ordinalInTableOfContents?: number
      sourceLineNumber?: number
    }
  ) {
    super(children)

    this.level = options.level
    this.ordinalInTableOfContents = options.ordinalInTableOfContents
    this.sourceLineNumber = options.sourceLineNumber
  }

  descendantsToIncludeInTableOfContents(): Document.TableOfContents.Entry[] {
    return []
  }

  searchableText(): string {
    return getSearchableText(this.children)
  }

  contentWithinTableOfContents(): InlineSyntaxNode[] {
    return this.children
  }

  render(renderer: Renderer): string {
    return renderer.heading(this)
  }
}
