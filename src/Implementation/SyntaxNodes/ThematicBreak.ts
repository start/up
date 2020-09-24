import { Renderer } from '../Rendering/Renderer'
import { Heading } from './Heading'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class ThematicBreak implements OutlineSyntaxNode {
  sourceLineNumber?: number

  constructor(options?: { sourceLineNumber: number }) {
    this.sourceLineNumber = options?.sourceLineNumber
  }

  descendantsToIncludeInTableOfContents(): Heading[] {
    return []
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return []
  }

  render(renderer: Renderer): string {
    return renderer.thematicBreak(this)
  }

  protected readonly THEMATIC_BREAK = undefined
}
