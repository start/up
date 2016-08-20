import { RichOutlineSyntaxNode } from './RichOutlineSyntaxNode'
import { Heading } from './Heading'


export class Blockquote extends RichOutlineSyntaxNode {
  shouldBeIncludedInTableOfContents(): boolean {
    return false
  }

  // As a rule, we don't want to include any blockquoted content in the table of contents.
  descendantsToIncludeInTableOfContents(): Heading[] {
    return []
  }

  protected BLOCKQUOTE(): void { }
}
