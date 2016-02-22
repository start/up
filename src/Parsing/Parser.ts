import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'

export interface ParseContextArgs {
  parentNode?: RichSyntaxNode,
  // TODO: Add an outline equivalent, or make this field applicable for both
  inlineTerminator?: string
}

export interface OnParse {
  (resultNodes: SyntaxNode[], countCharsParsed: number, parentNode: RichSyntaxNode): void
}

export interface Parser {
  (text: string, parseArgs: ParseContextArgs, onParse: OnParse): boolean
}