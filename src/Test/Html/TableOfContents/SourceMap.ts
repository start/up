import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Heading } from '../../../SyntaxNodes/Heading'
import { PlainText } from '../../../SyntaxNodes/PlainText'


context("When an item referenced by the table of contents has a source line number", () => {
  specify("its entry within the table of content's <nav> element isn't given a 'data-up-source-line' attribute", () => {
    const heading =
      new Heading([new PlainText('I enjoy apples')], 1, 2)

    const document =
      new UpDocument([heading], new UpDocument.TableOfContents([heading]))

    expect(Up.toHtml(document)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>Table of Contents</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-item-1">I enjoy apples</a></h2></li>'
      + '</ul>'
      + '</nav>'
      + '<h1 data-up-source-line="2" id="up-item-1">I enjoy apples</h1>')
  })
})
