import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { FootnoteNode } from './FootnoteNode'
import { Sequence } from '../Sequence'

export class CodeBlockNode implements OutlineSyntaxNode {
  constructor(public text: string) { }

  processFootnotesAndGetThoseThatAreStillBlockless(_: Sequence): FootnoteNode[] { return [] }

  OUTLINE_SYNTAX_NODE(): void { }
  protected CODE_BLOCK_NODE(): void { }
}
