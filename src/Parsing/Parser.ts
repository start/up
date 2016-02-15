import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'

export interface ParseArgs {
  parentNode?: RichSyntaxNode,
  // TODO: Add an outline equivalent, or make this field work applicable for both
  inlineTerminator?: string
}

export interface OnParse {
  (resultNodes: SyntaxNode[], countCharsParsed: number, parentNode: RichSyntaxNode): void
}

export interface Parser {
  (text: string, parseArgs: ParseArgs, onParse: OnParse): boolean
}