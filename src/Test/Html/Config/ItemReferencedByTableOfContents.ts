import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Heading } from '../../../SyntaxNodes/Heading'
import { PlainText } from '../../../SyntaxNodes/PlainText'


describe('The ID of an element referenced by the table of contents', () => {
  it('uses the config term for "itemReferencedByTableOfContents"', () => {
    const up = new Up({
      terms: {
        output: {
          itemReferencedByTableOfContents: 'table of contents entry'
        }
      }
    })

    const heading =
      new Heading([new PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

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
