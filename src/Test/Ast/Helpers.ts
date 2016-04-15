import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { InlineSyntaxNode } from '../../SyntaxNodes/InlineSyntaxNode'

export function insideDocumentAndParagraph(nodes: InlineSyntaxNode[]): DocumentNode {
  return new DocumentNode([
    new ParagraphNode(nodes)
  ])
}
