import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { InlineSyntaxNode } from '../SyntaxNodes/InlineSyntaxNode'

export interface MediaSyntaxNodeType {
  new(description: string, url: string): MediaSyntaxNode
}

export abstract class MediaSyntaxNode extends InlineSyntaxNode {
  constructor(public description: string, public url: string) {
    super()
  }
  
  private MEDIA_SYNTAX_NODE: any = null
}