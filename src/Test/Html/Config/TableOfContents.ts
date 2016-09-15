import { expect } from 'chai'
import Up = require('../../../index')


describe('The main heading within the table of contents', () => {
  it('uses the term for "tableOfContents"', () => {
    const up = new Up({
      rendering: {
        terms: { tableOfContents: 'In This Article' }
      }
    })

    const heading =
      new Up.Heading([new Up.PlainText('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new Up.Document([heading], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      up.renderDocumentAndTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<nav class="up-table-of-contents">'
      + '<h1>In This Article</h1>'
      + '<ul>'
      + '<li><h2><a href="#up-topic-1">I enjoy apples</a></h2></li>'
      + '</ul>'
      + '</nav>')

    expect(documentHtml).to.equal(
      '<h1 id="up-topic-1">I enjoy apples</h1>')
  })
})
