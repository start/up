import { SyntaxNode } from './SyntaxNode'

export class PlainTextNode extends SyntaxNode {
  constructor(public content: string) {
    super()
  }
  
  text(): string {
    return this.content
  }
  
  private PLAIN_TEXT: any = null
}