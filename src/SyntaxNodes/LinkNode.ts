import { RichInlineSyntaxNode } from './RichInlineSyntaxNode'
import { InlineSyntaxNode } from './InlineSyntaxNode'


export class LinkNode extends RichInlineSyntaxNode {
  // If a line consists solely of media conventions, those media conventions are placed directly
  // into the outline (rather than inside a paragraph)
  //
  // If an image is "linkified", or if it is otherwise the sole convention within a link, the
  // container link counts as an image for the purpose that rule. Under that specific circumstance,
  // link nodes act as outline syntax nodes. 
  OUTLINE_SYNTAX_NODE(): void { } 

  constructor(public children: InlineSyntaxNode[] = [], public url: string = '') {
    super(children)
  }

  private LINK: any = null
}
