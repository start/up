import { SyntaxNode } from './SyntaxNode'

export class InlineCodeNode extends SyntaxNode {
  constructor(private text: string) {
    super()
  }
  
  private INLINE_CODE: any = null
}