import { InlineSyntaxNode } from './InlineSyntaxNode'

export class PlainTextNode extends InlineSyntaxNode {
  constructor(public text: string) {
    super()
  }
  
  private PLAIN_TEXT: any = null
}


export function isWhitespace(node: InlineSyntaxNode): boolean {
  return (node instanceof PlainTextNode) && !node.text.trim()
}