import { expect } from 'chai'
import Up from '../../../index'
import { InlineSpoilerNode } from '../../../SyntaxNodes/InlineSpoilerNode'
import { SpoilerBlockNode } from '../../../SyntaxNodes/SpoilerBlockNode'


describe("The text in an inline spoiler's label", () => {
  it("uses the provided term for 'toggleSpoiler'", () => {
    const up = new Up({
      i18n: {
        terms: { toggleSpoiler: 'show/hide' }
      }
    })

    const node = new InlineSpoilerNode([])

    const html =
      '<span class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-1">show/hide</label>'
      + '<input id="up-spoiler-1" type="checkbox">'
      + '<span></span>'
      + '</span>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})


describe("The text in a spoiler block's label", () => {
  it("uses the provided term for 'toggleSpoiler'", () => {
    const up = new Up({
      i18n: {
        terms: { toggleSpoiler: 'show/hide' }
      }
    })

    const node = new SpoilerBlockNode([])

    const html =
      '<div class="up-spoiler up-revealable">'
      + '<label for="up-spoiler-1">show/hide</label>'
      + '<input id="up-spoiler-1" type="checkbox">'
      + '<div></div>'
      + '</div>'

    expect(up.toHtml(node)).to.be.eql(html)
  })
})

