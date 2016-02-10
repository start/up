import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'

export interface OnParse {
  (resultNodes: SyntaxNode[], countCharsParsed: number): void
}

export interface Parser {
  (text: string, currentNode: RichSyntaxNode, terminatedBy: string, onParse: OnParse): boolean
}