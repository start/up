import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'


export class LinkNode extends RichInlineSyntaxNode {
  // If a line consists solely of media conventions (and/or whitespace), those media conventions are
  // placed directly into the outline rather than inside a paragraph.
  //
  // If an image is "linkified", or if a link otherwise contains only images (and whitespace), the link
  // counts as an image for the purpose of the rule above. In that situation, the link itself is placed
  // directly into the outline.
  OUTLINE_SYNTAX_NODE(): void { } 
  private LINK: any = null

  constructor(public children: InlineSyntaxNode[] = [], public url: string = '') {
    super(children)
  }
}
