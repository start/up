import { expect } from 'chai'
import Up from '../../../index'
import { UpDocument } from '../../../SyntaxNodes/UpDocument'
import { Heading } from '../../../SyntaxNodes/Heading'
import { PlainText } from '../../../SyntaxNodes/PlainText'


describe('The main heading within the table of contents', () => {
  it('uses the config term for "tableOfContents"', () => {
    const up = new Up({
      terms: {
        output: {
          tableOfContents: 'In This Article'
        }
      }
    })

    const heading =
      new Heading([new PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new UpDocument([heading], new UpDocument.TableOfContents([heading]))

    expect(up.toHtml(document)).to.be.eql(
      '<nav class="up-table-of-contents">'
      + '<h1>In This Article</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-item-1">I enjoy apples</a></h2></li>'
      + '</ul>'
      + '</nav>'
      + '<h1 id="up-item-1">I enjoy apples</h1>')
  })
})
