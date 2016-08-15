import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { HeadingNode } from '../../../SyntaxNodes/HeadingNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'


describe('The ID of an element referenced by the table of contents', () => {
  it('uses the config term for "itemReferencedByTableOfContents"', () => {
    const up = new Up({
      terms: { itemReferencedByTableOfContents: 'table of contents entry' }
    })

    const heading =
      new HeadingNode([new PlainTextNode('I enjoy apples')], 1)

    const document =
      new UpDocument([heading], new UpDocument.TableOfContents([heading]))

    expect(up.toHtml(document)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-table-of-contents-entry-1">I enjoy apples</a></h2></li>'
      + '</ul>'
      + '</nav>'
      + '<h1 id="up-table-of-contents-entry-1">I enjoy apples</h1>')
  })
})
