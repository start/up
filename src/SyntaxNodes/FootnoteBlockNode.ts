import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { Footnote } from './Footnote'

export class FootnoteBlockNode extends OutlineSyntaxNode {
  constructor(public footnotes: Footnote[] = []) {
    super()
  }

  private FOOTNOTE_BLOCK: any = null
}
