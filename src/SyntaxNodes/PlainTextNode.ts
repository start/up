import { SyntaxNode } from './SyntaxNode'

export class PlainTextNode extends SyntaxNode {
  constructor(private plainText: string) {
    super()
  }
  
  text(): string {
    return this.plainText
  }
  
  absorb(plainTextNode: PlainTextNode) {
    this.plainText += plainTextNode.text()
  }
  
  private PLAIN_TEXT: any = null
}