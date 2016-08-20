import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'
import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { Heading } from './Heading'


// If a line consists solely of media conventions (and/or whitespace), those media conventions are
// placed directly into the outline rather into a paragraph.
//
// If a media convention is "linkified", or if a link otherwise contains only media conventions (and
// whitespace), the link counts as media. In that situation, the link itself is placed directly into
// the outline.
export class Link extends RichInlineSyntaxNode implements OutlineSyntaxNode {
  constructor(children: InlineSyntaxNode[], public url: string, public sourceLineNumber: number = undefined) {
    super(children)
  }

  shouldBeIncludedInTableOfContents(): boolean {
    return false
  }

  descendantsToIncludeInTableOfContents(): Heading[] {
    return []
  }
}
