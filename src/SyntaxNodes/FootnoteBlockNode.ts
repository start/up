import { FootnoteNode } from './FootnoteNode'


export class FootnoteBlockNode {
  OUTLINE_SYNTAX_NODE(): void { }
  
  constructor(public footnotes: FootnoteNode[] = []) { }

  private FOOTNOTE_BLOCK: any = null
}
