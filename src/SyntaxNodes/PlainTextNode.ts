import { SyntaxNode } from './SyntaxNode'

export class PlainTextNode extends SyntaxNode {
  constructor(private plainText: string) {
    super(null)
  }
  
  text(): string {
    return this.plainText
  }
  
  private PLAIN_TEXT: any = null
}