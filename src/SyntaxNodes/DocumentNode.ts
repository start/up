import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { OutlineSyntaxNodeContainer } from './OutlineSyntaxNodeContainer'
import { insertFootnoteBlocksAndAssignFootnoteReferenceNumbers } from './insertFootnoteBlocksAndAssignFootnoteReferenceNumbers'


export class DocumentNode extends OutlineSyntaxNodeContainer {
  constructor(children: OutlineSyntaxNode[], public tableOfContents?: DocumentNode.TableOfContents) {
    super(children)
  }
}


export namespace DocumentNode {
  export class TableOfContents {
    constructor(public entries: OutlineSyntaxNode[]) { }
  }
}


// TODO: Test this function alone, outside of the parsing process.
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
