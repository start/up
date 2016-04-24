import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { FootnoteReferenceNode } from './FootnoteReferenceNode'

export class FootnoteBlockNode extends OutlineSyntaxNode {
  constructor(public footnoteReferences: FootnoteReferenceNode[] = []) {
    super()
  }

  private FOOTNOTE_BLOCK: any = null
}
