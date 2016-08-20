import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { Heading } from './Heading'


export class OutlineSeparator implements OutlineSyntaxNode {
  constructor(public sourceLineNumber: number = undefined) { }

  shouldBeIncludedInTableOfContents(): boolean {
    return false
  }

  descendantsToIncludeInTableOfContents(): Heading[] {
    return []
  }

  protected OUTLINE_SEPARATOR(): void { }
}
