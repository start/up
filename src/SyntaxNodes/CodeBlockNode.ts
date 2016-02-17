import { SyntaxNode } from './SyntaxNode'

export class CodeBlockNode extends SyntaxNode {
  constructor(private plainText: string) {
    super()
  }
  
  private CODE_BLOCK: any = null
}