export interface MediaSyntaxNodeType {
  new (description: string, url: string): MediaSyntaxNode
}

export abstract class MediaSyntaxNode {
  mediaSyntaxNode(): void { }
  inlineSyntaxNode(): void { }

  // If a line consists solely of media conventions, those media conventions are placed directly
  // into the outline (rather than inside a paragraph)
  outlineSyntaxNode(): void { }

  constructor(public description: string, public url: string) { }
}
