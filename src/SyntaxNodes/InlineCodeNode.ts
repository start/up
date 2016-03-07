import { InlineSyntaxNode } from './InlineSyntaxNode'

export class InlineCodeNode extends InlineSyntaxNode {
  constructor(text: string) {
    super()  
  }
  private INLINE_CODE: any = null
}