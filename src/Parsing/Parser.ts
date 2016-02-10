import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'

export interface OnParse {
  (resultNodes: SyntaxNode[], countCharsParsed: number): void
}

export interface Parser {
  (text: string, parentNode: RichSyntaxNode, parentTerminatesOn: string, onParse: OnParse): boolean
}