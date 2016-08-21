import { UpDocument } from './UpDocument'
import { SyntaxNode } from './SyntaxNode'


export interface OutlineSyntaxNode extends SyntaxNode {
  sourceLineNumber: number
  descendantsToIncludeInTableOfContents(): UpDocument.TableOfContents.Entry[]
}
