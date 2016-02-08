import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'

interface OnParse {
  (nodes: SyntaxNode[], countCharsParsed: number): void
}

export interface Parser {
  (text: string, parentNode: RichSyntaxNode, onParse: OnParse): boolean
}