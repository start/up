import { OutlineSyntaxNode } from './OutlineSyntaxNode'
import { Heading } from './Heading'
import { allHeadingsToIncludeInTableOfContents } from './allHeadingsToIncludeInTableOfContents'


export abstract class OutlineSyntaxNodeContainer {
  constructor(public children: OutlineSyntaxNode[]) { }

  descendantHeadingsToIncludeInTableOfContents(): Heading[] {
    return allHeadingsToIncludeInTableOfContents(this.children)
  }
}
