import { expect } from 'chai'
import * as Up from '../../../Up'


describe('The ID of an element referenced by the table of contents', () => {
  it('uses the term for "sectionReferencedByTableOfContents"', () => {
    const up = new Up.Transformer({
      rendering: {
        terms: { sectionReferencedByTableOfContents: 'table of contents entry' }
      }
    })

    const heading =
      new Up.Heading([new Up.Text('I enjoy apples')], { level: 1, ordinalInTableOfContents: 1 })

    const document =
      new Up.Document([heading], new Up.Document.TableOfContents([heading]))

    const { tableOfContentsHtml, documentHtml } =
      up.renderDocumentAndTableOfContents(document)

    expect(tableOfContentsHtml).to.equal(
      '<h1><a href="#up-table-of-contents-entry-1">I enjoy apples</a></h1>')

    expect(documentHtml).to.equal(
      '<h1 id="up-table-of-contents-entry-1">I enjoy apples</h1>')
  })
})
