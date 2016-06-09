import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { FootnoteNode } from './FootnoteNode'


export class FootnoteBlockNode extends OutlineSyntaxNode {
  constructor(public footnotes: FootnoteNode[] = []) {
    super()
  }

  private FOOTNOTE_BLOCK: any = null
}
