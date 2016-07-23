import { FootnoteNode } from './FootnoteNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class FootnoteBlockNode implements OutlineSyntaxNode {
  constructor(public footnotes: FootnoteNode[]) { }

  OUTLINE_SYNTAX_NODE(): void { }
  protected FOOTNOTE_BLOCK_NODE(): void { }
}
