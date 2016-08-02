import { expect } from 'chai'
import Up from '../../../index'
import { InlineNsflNode } from '../../../SyntaxNodes/InlineNsflNode'
import { NsflBlockNode } from '../../../SyntaxNodes/NsflBlockNode'


describe("The ID of an inline NSFL convention's checkbox (on both the checkbox and the label)", () => {
  it("uses the provided term for 'nsfl'", () => {
    const up = new Up({
      i18n: {
        terms: { nsfl: 'life ruining' }
      }
    })

    const node = new InlineNsflNode([])

    const html =
      '<span class="up-nsfl up-revealable">'
      + '<label for="up-life-ruining-1">toggle NSFL</label>'
      + '<input id="up-life-ruining-1" type="checkbox">'
      + '<span></span>'
      + '</span>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})


describe("The ID of a NSFL block's checkbox (on both the checkbox and the label)", () => {
  it("uses the provided term for 'nsfl'", () => {
    const up = new Up({
      i18n: {
        terms: { nsfl: 'life ruining' }
      }
    })

    const node = new NsflBlockNode([])

    const html =
      '<div class="up-nsfl up-revealable">'
      + '<label for="up-life-ruining-1">toggle NSFL</label>'
      + '<input id="up-life-ruining-1" type="checkbox">'
      + '<div></div>'
      + '</div>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})
