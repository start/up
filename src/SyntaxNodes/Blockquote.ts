import { RichOutlineSyntaxNode } from './RichOutlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'


export class Blockquote extends RichOutlineSyntaxNode {
  shouldBeIncludedInTableOfContents(): boolean {
    return false
  }

  // As a rule, we don't want to include any blockquoted content in the table of contents.
  descendantsToIncludeInTableOfContents(): OutlineSyntaxNode[] {
    return []
  }

  protected BLOCKQUOTE(): void { }
}
