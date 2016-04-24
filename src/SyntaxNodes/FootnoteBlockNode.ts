import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { FootnoteNode } from './FootnoteReferenceNode'

export class FootnoteBlockNode extends OutlineSyntaxNode {
  constructor(public footnoteReferences: FootnoteNode[] = []) {
    super()
  }

  private FOOTNOTE_BLOCK: any = null
}
