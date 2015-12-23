import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../SyntaxNodes/PlainTextNode'

export function parse(text: string): DocumentNode {
  const documentNode = new DocumentNode
  
  if (text) {
    documentNode.children.push(new PlainTextNode(text))
  }
  
  return documentNode
}