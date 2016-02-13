import { SyntaxNode } from './SyntaxNode'

export class InlineCodeNode extends SyntaxNode {
  constructor(private plainText: string) {
    super()
  }

  text(): string {
    return this.plainText
  }
  
  private INLINE_CODE: any = null
}