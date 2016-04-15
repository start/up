import { InlineSyntaxNode } from './InlineSyntaxNode'

export class InlineCodeNode extends InlineSyntaxNode {
  constructor(public text: string) {
    super()  
  }
  
  private INLINE_CODE: any = null
}
