import { UpDocument } from './UpDocument'


export interface OutlineSyntaxNode {
  sourceLineNumber: number
  descendantsToIncludeInTableOfContents(): UpDocument.TableOfContents.Entry[]
}
