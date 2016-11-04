import { expect } from 'chai'
import * as Up from '../../../Main'


describe('The ID of an element referenced by the table of contents', () => {
  it('uses the term for "sectionReferencedByTableOfContents"', () => {
    const up = new Up.Up({
      rendering: {
        terms: { sectionReferencedByTableOfContents: 'table of contents entry' }
      }
    })

    const NOT_USED: string = null

    const heading =
      new Up.Heading([new Up.Text('I enjoy apples')], {
        level: 1,
        titleMarkup: NOT_USED,
        ordinalInTableOfContents: 1
      })

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
