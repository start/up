import { FootnoteNode } from './FootnoteNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class FootnoteBlockNode implements OutlineSyntaxNode {
  constructor(public footnotes: FootnoteNode[]) { }

  shouldBeIncludedInTableOfContents(): boolean {
    return false
  }

  protected FOOTNOTE_BLOCK_NODE(): void { }
}
