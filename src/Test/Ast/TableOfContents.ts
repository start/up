import { expect } from 'chai'
import Up from '../../index'
import { DocumentNode } from '../../SyntaxNodes/DocumentNode'
import { PlainTextNode } from '../../SyntaxNodes/PlainTextNode'
/*import { StressNode } from '../../SyntaxNodes/StressNode'
import { ParagraphNode } from '../../SyntaxNodes/ParagraphNode'
import { SectionSeparatorNode } from '../../SyntaxNodes/SectionSeparatorNode'*/
import { HeadingNode } from '../../SyntaxNodes/HeadingNode'


context("When the 'createTableOfContents' config setting isn't specified as true", () => {
  specify("the document isn't given a table of contents", () => {
    const markup = `
I enjoy apples
==============`

    const tableOfContents: DocumentNode.TableOfContents = undefined

    expect(Up.toAst(markup)).to.be.eql(
      new DocumentNode([
        new HeadingNode([new PlainTextNode('I enjoy apples')], 1),
      ], tableOfContents))
  })
})
