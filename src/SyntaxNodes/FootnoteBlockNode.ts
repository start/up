import { FootnoteNode } from './FootnoteNode'


export class FootnoteBlockNode {
  OUTLINE_SYNTAX_NODE(): void { }

  constructor(public footnotes: FootnoteNode[]) { }

  protected FOOTNOTE_BLOCK_NODE(): void { }
}
