import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { Heading } from './Heading'


export class OutlineSeparator implements OutlineSyntaxNode {
  constructor(public sourceLineNumber: number = undefined) { }

  descendantHeadingsToIncludeInTableOfContents(): Heading[] {
    return []
  }

  protected OUTLINE_SEPARATOR(): void { }
}
