import { SyntaxNode } from './SyntaxNode'

export class PlainTextNode extends SyntaxNode {
  constructor(public content: string) {
    super()
  }
  
  private PLAIN_TEXT: any = null
}