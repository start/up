import { Renderer } from '../Rendering/Renderer'
import { Heading } from './Heading'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'


// If a line consists solely of media conventions (or media conventions within links),
// those media conventions are placed directly into the outline.
export abstract class MediaSyntaxNode implements InlineSyntaxNode, OutlineSyntaxNode {
  sourceLineNumber?: number

  constructor(
    public description: string,
    public url: string,
    options?: { sourceLineNumber: number }
  ) {
      this.sourceLineNumber = options?.sourceLineNumber
  }

  textAppearingInline(): string {
    return ''
  }

  descendantsToIncludeInTableOfContents(): Heading[] {
    return []
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return []
  }

  abstract render(renderer: Renderer): string

  protected readonly MEDIA_SYNTAX_NODE = undefined
}

export type MediaSyntaxNodeType = new (description: string, url: string) => MediaSyntaxNode
