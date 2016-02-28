import { SyntaxNode } from '../../SyntaxNodes/SyntaxNode'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'

export function insideDocumentAndParagraph(nodes: SyntaxNode[]): DocumentNode {
  return new DocumentNode([
    new ParagraphNode(nodes)
  ])
}
