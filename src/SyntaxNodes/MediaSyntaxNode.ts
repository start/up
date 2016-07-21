export interface MediaSyntaxNodeType {
  new (description: string, url: string): MediaSyntaxNode
}

export abstract class MediaSyntaxNode {
  // If a line consists solely of media conventions, those media conventions are placed directly
  // into the outline. Otherwise, media conventions are placed within a paragraph (or line block). 
  OUTLINE_SYNTAX_NODE(): void { }
  INLINE_SYNTAX_NODE(): void { }
  protected MEDIA_SYNTAX_NODE(): void { }

  constructor(public description: string, public url: string) { }
}
