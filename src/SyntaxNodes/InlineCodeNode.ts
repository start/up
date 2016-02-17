import { SyntaxNode } from './SyntaxNode'

export class InlineCodeNode extends SyntaxNode {
  constructor(private plainText: string) {
    super()
  }
  
  private INLINE_CODE: any = null
}