import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'

export class ImageNode extends InlineSyntaxNode {
  constructor(public description: string, public url: string = '') {
    super()
  }
  
  private IMAGE: any = null
}