import { FootnoteNode } from './FootnoteNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class FootnoteBlockNode implements OutlineSyntaxNode {
  constructor(public footnotes: FootnoteNode[]) { }

  shouldBeIncludedInTableOfContents(): boolean {
    return false
  }
  
  descendantsToIncludeInTableOfContents(): OutlineSyntaxNode[] {
    return []
  }

  protected FOOTNOTE_BLOCK_NODE(): void { }
}
