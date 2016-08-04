import { DocumentNode } from '../SyntaxNodes/DocumentNode'
import { OutlineSyntaxNode } from '../SyntaxNodes/OutlineSyntaxNode'
import { insertFootnoteBlocksAndAssignFootnoteReferenceNumbers } from './insertFootnoteBlocksAndAssignFootnoteReferenceNumbers'


export function getFinalizedDocument(
  args: {
    documentChildren: OutlineSyntaxNode[]
    createTableOfContents: boolean
  }
): DocumentNode {
  const documentNode = new DocumentNode(args.documentChildren)
  insertFootnoteBlocksAndAssignFootnoteReferenceNumbers(documentNode)

  if (args.createTableOfContents) {
    const tableOfContentsEntries = documentNode.descendantsToIncludeInTableOfContents()

    documentNode.tableOfContents =
      new DocumentNode.TableOfContents(tableOfContentsEntries)
  }

  return documentNode
}
