import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { Document } from './Document'
import { Renderer } from '../Rendering/Renderer'


// If a line consists solely of media conventions (or media conventions within links),
// those media conventions are placed directly into the outline.
export abstract class MediaSyntaxNode implements InlineSyntaxNode, OutlineSyntaxNode {
  public sourceLineNumber: number = undefined

  constructor(
    public description: string,
    public url: string,
    options?: { sourceLineNumber: number }
  ) {
    if (options) {
      this.sourceLineNumber = options.sourceLineNumber
    }
  }

  textAppearingInline(): string {
    return ''
  }

  descendantsToIncludeInTableOfContents(): Document.TableOfContents.Entry[] {
    return []
  }

  inlineDescendants(): InlineSyntaxNode[] {
    return []
  }

  abstract render(renderer: Renderer): string

  protected MEDIA_SYNTAX_NODE(): void { }
}

export interface MediaSyntaxNodeType {
  new (description: string, url: string): MediaSyntaxNode
}
