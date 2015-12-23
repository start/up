import { SyntaxNode } from './SyntaxNode'

export class InlineCodeNode extends SyntaxNode {
  constructor(private plainText: string) {
    super(null)
  }
  
  text(): string {
    return this.plainText
  }
  
  INLINE_CODE_NODE: any = null
}