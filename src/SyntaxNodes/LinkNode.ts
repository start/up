import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'


export class LinkNode extends RichInlineSyntaxNode {
  // If a line consists solely of media conventions (and/or whitespace), those media conventions are
  // placed directly into the outline rather into a paragraph.
  //
  // If a media convention is "linkified", or if a link otherwise contains only media conventions (and
  // whitespace), the link counts as media. In that situation, the link itself is placed directly into
  // the outline.
  OUTLINE_SYNTAX_NODE(): void { }
  protected LINK: any = null

  constructor(public children: InlineSyntaxNode[], public url: string) {
    super(children)
  }
}
