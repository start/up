import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'

export class AudioNode extends InlineSyntaxNode {
  constructor(public description: string, public url: string = '') {
    super()
  }
  
  private AUDIO: any = null
}