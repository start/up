import { expect } from 'chai'
import Up from '../../../index'
import { InlineNsflNode } from '../../../SyntaxNodes/InlineNsflNode'


describe("The text in an inline NSFL convention's label", () => {
  it("uses the provided term for 'toggleNsfl'", () => {
    const up = new Up({
      i18n: {
        terms: { toggleNsfl: 'show/hide' }
      }
    })

    const node = new InlineNsflNode([])

    const html =
      '<span class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-1">show/hide</label>'
      + '<input id="up-nsfl-1" type="checkbox">'
      + '<span></span>'
      + '</span>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})
