import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'

export class VideoNode extends InlineSyntaxNode {
  constructor(public description: string, public url: string = '') {
    super()
  }
  
  private VIDEO: any = null
}