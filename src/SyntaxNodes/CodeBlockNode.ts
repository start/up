import { SyntaxNode } from './SyntaxNode'

export class CodeBlockNode extends SyntaxNode {
  constructor(private plainText: string) {
    super()
  }

  text(): string {
    return this.plainText
  }
  
  private CODE_BLOCK: any = null
}