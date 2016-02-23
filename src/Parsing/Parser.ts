import { SyntaxNode } from '../SyntaxNodes/SyntaxNode'
import { RichSyntaxNode } from '../SyntaxNodes/RichSyntaxNode'

export interface ParseContext {
  parentNode?: RichSyntaxNode,
  // TODO: Add an outline equivalent, or make this field applicable for both
  inlineTerminator?: string
}

export interface ParseArgs {
  text: string,
  context: ParseContext,
  then: OnParse
}

export interface OnParse {
  (resultNodes: SyntaxNode[], countCharsParsed: number, parentNode: RichSyntaxNode): void
}

export interface Parser {
  (text: string, parseArgs: ParseContext, onParse: OnParse): boolean
}