import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'

export interface ParseArgs {
  parentNode?: RichSyntaxNode,
  terminator?: string
}

export interface OnParse {
  (resultNodes: SyntaxNode[], countCharsParsed: number, parentNode: RichSyntaxNode): void
}

export interface Parser {
  (text: string, parseArgs: ParseArgs, onParse: OnParse): boolean
}