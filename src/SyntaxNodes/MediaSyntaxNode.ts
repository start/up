import { InlineSyntaxNode } from '../SyntaxNodes/InlineSyntaxNode'


export interface MediaSyntaxNodeType {
  new (description: string, url: string): MediaSyntaxNode
}

export abstract class MediaSyntaxNode {
  mediaSyntaxNode(): void { }
  outlineSyntaxNode(): void { }
  inlineSyntaxNode(): void { }

  constructor(public description: string, public url: string) { }
}
