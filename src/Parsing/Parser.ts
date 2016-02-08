import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'

interface OnParse {
  (nodes: SyntaxNode[], countCharsParsed: number): void
}

export interface Parser {
  (text: string, onParse: OnParse): boolean
}