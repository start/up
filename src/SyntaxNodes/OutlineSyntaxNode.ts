import { Document } from './Document'
import { SyntaxNode } from './SyntaxNode'


export interface OutlineSyntaxNode extends SyntaxNode {
  sourceLineNumber: number
  descendantsToIncludeInTableOfContents(): Document.TableOfContents.Entry[]
}
