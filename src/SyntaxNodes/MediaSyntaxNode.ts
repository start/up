export interface MediaSyntaxNodeType {
  new (description: string, url: string): MediaSyntaxNode
}

export abstract class MediaSyntaxNode {
  INLINE_SYNTAX_NODE(): void { }

  // If a line consists solely of media conventions, those media conventions are placed directly
  // into the outline (rather than inside a paragraph)
  OUTLINE_SYNTAX_NODE(): void { }

  constructor(public description: string, public url: string) { }
}
