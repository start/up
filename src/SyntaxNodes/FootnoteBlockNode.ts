import { FootnoteNode } from './FootnoteNode'


export class FootnoteBlockNode {
  OUTLINE_SYNTAX_NODE(): void { }
  protected FOOTNOTE_BLOCK: any = null
  
  constructor(public footnotes: FootnoteNode[]) { }
}
