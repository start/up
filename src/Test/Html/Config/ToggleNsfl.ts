import { expect } from 'chai'
import Up from '../../../index'
import { PlainTextNode } from '../../../SyntaxNodes/PlainTextNode'
import { FootnoteNode } from '../../../SyntaxNodes/FootnoteNode'
import { FootnoteBlockNode } from '../../../SyntaxNodes/FootnoteBlockNode'
import { NsflNode } from '../../../SyntaxNodes/NsflNode'


describe("The text in a NSFL convention's label", () => {
  it("uses the provided term for 'toggleNsfl'", () => {
    const up = new Up({
      i18n: {
        terms: { toggleNsfl: 'show/hide' }
      }
    })

    const node = new NsflNode([])

    const html =
      '<span class="up-nsfl up-revealable">'
      + '<label for="up-nsfl-1">show/hide</label>'
      + '<input id="up-nsfl-1" type="checkbox">'
      + '<span></span>'
      + '</span>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})
