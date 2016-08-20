import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { Heading } from './Heading'


// If a line consists solely of media conventions, those media conventions are placed directly
// into the outline. Otherwise, media conventions are placed within a paragraph (or line block).
export abstract class MediaSyntaxNode implements InlineSyntaxNode, OutlineSyntaxNode {
  constructor(
    public description: string,
    public url: string,
    public sourceLineNumber: number = undefined) { }

  text(): string {
    return ''
  }

  descendantsToIncludeInTableOfContents(): Heading[] {
    return []
  }

  protected MEDIA_SYNTAX_NODE(): void { }
}

export interface MediaSyntaxNodeType {
  new (description: string, url: string): MediaSyntaxNode
}
