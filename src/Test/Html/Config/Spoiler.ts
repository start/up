import { expect } from 'chai'
import Up from '../../../index'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'
import { SpoilerBlockNode } from '../../../SyntaxNodes/SpoilerBlockNode'


describe("The ID of an inline spoiler's checkbox (on both the checkbox and the label)", () => {
  it("uses the provided term for 'spoiler'", () => {
    const up = new Up({
      i18n: {
        terms: { spoiler: 'ruins ending' }
      }
    })

    const node = new InlineSpoilerNode([])

    const html =
      '<span class="up-spoiler up-revealable">'
      + '<label for="up-ruins-ending-1">toggle spoiler</label>'
      + '<input id="up-ruins-ending-1" type="checkbox">'
      + '<span></span>'
      + '</span>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})


describe("The ID of a spoiler block's checkbox (on both the checkbox and the label)", () => {
  it("uses the provided term for 'spoiler'", () => {
    const up = new Up({
      i18n: {
        terms: { spoiler: 'ruins ending' }
      }
    })

    const node = new SpoilerBlockNode([])

    const html =
      '<div class="up-spoiler up-revealable">'
      + '<label for="up-ruins-ending-1">toggle spoiler</label>'
      + '<input id="up-ruins-ending-1" type="checkbox">'
      + '<div></div>'
      + '</div>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})
