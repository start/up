import { SyntaxNode } from './SyntaxNode'

export class PlainTextNode extends SyntaxNode {
  constructor(private plainText: string) {
    super(null)
  }
  
  text(): string {
    return this.plainText
  }
  
  PLAIN_TEXT_NODE = 'plain text node'
}