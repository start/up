import { expect } from 'chai'
import Up from '../../../index'
import { DocumentNode } from '../../../SyntaxNodes/DocumentNode'
import { HeadingNode } from '../../../SyntaxNodes/HeadingNode'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'


describe('The ID of an element referenced by the table of contents', () => {
  it('uses the config term for "outline"', () => {
    const up = new Up({
      i18n: {
        terms: { outline: 'table of contents entry' }
      }
    })

    const heading =
      new HeadingNode([new PlainTextNode('I enjoy apples')], 1)

    const documentNode =
      new DocumentNode([heading], new DocumentNode.TableOfContents([heading]))

    expect(up.toHtml(documentNode)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-table-of-contents-entry-1">I enjoy apples</a></h2></li>'
      + '</ul>'
      + '</nav>'
      + '<h1 id="up-table-of-contents-entry-1">I enjoy apples</h1>')
  })
})